import { PayloadAction } from '@reduxjs/toolkit'
import TransportWebUSB from '@ledgerhq/hw-transport-webusb'
import * as oasis from '@oasisprotocol/client'
import { publicKeyToAddress, uint2hex } from 'app/lib/helpers'
import { Ledger, LedgerSigner } from 'app/lib/ledger'
import { OasisTransaction } from 'app/lib/transaction'
import { all, call, put, select, takeEvery } from 'typed-redux-saga'
import { ErrorPayload, WalletError, WalletErrors } from 'types/errors'

import { multiAccountsActions } from '.'
import { selectChainContext } from '../network/selectors'
import { getBalance } from '../wallet/saga'
import { MultiAccountsListAccount, MultiAccountsStep } from './types'
import type Transport from '@ledgerhq/hw-transport'

function* setStep(step: MultiAccountsStep) {
  yield* put(multiAccountsActions.setStep(step))
}

function* getUSBTransport() {
  const isSupported = yield* call([TransportWebUSB, TransportWebUSB.isSupported])
  if (!isSupported) {
    throw new WalletError(WalletErrors.USBTransportNotSupported, 'TransportWebUSB unsupported')
  }
  try {
    const transport = yield* call([TransportWebUSB, TransportWebUSB.create])
    return transport
  } catch (e: any) {
    if (e.message.match(/No device selected/)) {
      throw new WalletError(WalletErrors.LedgerNoDeviceSelected, e.message)
    } else {
      throw new WalletError(WalletErrors.USBTransportError, e.message)
    }
  }
}

export const accountsNumberLimit = 5

function* enumerateAccountsFromMnemonic(action: PayloadAction<string>) {
  const wallets = []
  const mnemonic = action.payload

  try {
    yield* setStep(MultiAccountsStep.LoadingAccounts)
    for (let i = 0; i < accountsNumberLimit; i++) {
      const signer = yield* call(oasis.hdkey.HDKey.getAccountSigner, mnemonic, i)
      const address = yield* call(publicKeyToAddress, signer.publicKey)
      const balance = yield* call(getBalance, signer.publicKey)

      wallets.push({
        address,
        balance,
        path: [44, 474, i],
        selected: i === 0,
      } as MultiAccountsListAccount)
    }
    yield* setStep(MultiAccountsStep.Done)
    yield* put(multiAccountsActions.setMnemonic(mnemonic))
    yield* put(multiAccountsActions.accountsListed(wallets))
  } catch (e: any) {
    let payload: ErrorPayload
    if (e instanceof WalletError) {
      payload = { code: e.type, message: e.message }
    } else {
      payload = { code: WalletErrors.UnknownError, message: e.message }
    }

    yield* put(multiAccountsActions.operationFailed(payload))
  }
}

function* enumerateAccountsFromLedger() {
  yield* setStep(MultiAccountsStep.OpeningUSB)
  let transport: Transport | undefined
  try {
    transport = yield* getUSBTransport()

    yield* setStep(MultiAccountsStep.LoadingAccounts)
    const accounts = yield* call(Ledger.enumerateAccounts, transport)

    yield* setStep(MultiAccountsStep.LoadingBalances)
    const balances = yield* all(accounts.map(a => call(getBalance, a.publicKey)))
    const addresses = yield* all(accounts.map(a => call(publicKeyToAddress, a.publicKey)))

    const wallets = accounts.map((a, index) => {
      return {
        publicKey: uint2hex(a.publicKey),
        path: a.path,
        address: addresses[index],
        balance: balances[index],
        // We select the first account by default
        selected: index === 0,
      } as MultiAccountsListAccount
    })

    yield* setStep(MultiAccountsStep.Done)
    yield* put(multiAccountsActions.accountsListed(wallets))
  } catch (e: any) {
    let payload: ErrorPayload
    if (e instanceof WalletError) {
      payload = { code: e.type, message: e.message }
    } else {
      payload = { code: WalletErrors.UnknownError, message: e.message }
    }

    yield* put(multiAccountsActions.operationFailed(payload))
  } finally {
    if (transport) {
      yield* call([transport, transport.close])
    }
  }
}

export function* sign<T>(signer: LedgerSigner, tw: oasis.consensus.TransactionWrapper<T>) {
  const transport = yield* getUSBTransport()
  const chainContext = yield* select(selectChainContext)

  signer.setTransport(transport)
  try {
    yield* call([OasisTransaction, OasisTransaction.signUsingLedger], chainContext, signer, tw)
  } finally {
    yield* call([transport, transport.close])
  }
}

export function* multiAccountsSaga() {
  yield* takeEvery(multiAccountsActions.enumerateAccountsFromLedger, enumerateAccountsFromLedger)
  yield* takeEvery(multiAccountsActions.enumerateAccountsFromMnemonic, enumerateAccountsFromMnemonic)
}
