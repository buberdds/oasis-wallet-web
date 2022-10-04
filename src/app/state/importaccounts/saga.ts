import { PayloadAction } from '@reduxjs/toolkit'
import TransportWebUSB from '@ledgerhq/hw-transport-webusb'
import * as oasis from '@oasisprotocol/client'
import { publicKeyToAddress, uint2hex } from 'app/lib/helpers'
import { Ledger, LedgerSigner } from 'app/lib/ledger'
import { OasisTransaction } from 'app/lib/transaction'
import { all, call, put, select, takeEvery } from 'typed-redux-saga'
import { ErrorPayload, WalletError, WalletErrors } from 'types/errors'
import { WalletType } from 'app/state/wallet/types'
import { importAccountsActions } from '.'
import { selectChainContext } from '../network/selectors'
import { getBalance } from '../wallet/saga'
import { ImportAccountsListAccount, ImportAccountsStep } from './types'
import type Transport from '@ledgerhq/hw-transport'
import wallet from '../wallet'
import browser from 'webextension-polyfill'

function* setStep(step: ImportAccountsStep) {
  yield* put(importAccountsActions.setStep(step))
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
    yield* setStep(ImportAccountsStep.LoadingAccounts)
    for (let i = 0; i < accountsNumberLimit; i++) {
      const signer = yield* call(oasis.hdkey.HDKey.getAccountSigner, mnemonic, i)
      const address = yield* call(publicKeyToAddress, signer.publicKey)
      const balance = yield* call(getBalance, signer.publicKey)

      wallets.push({
        address,
        balance,
        path: [44, 474, i],
        privateKey: uint2hex(signer.secretKey),
        publicKey: uint2hex(signer.publicKey),
        selected: i === 0,
        type: WalletType.Mnemonic,
      } as ImportAccountsListAccount)
    }
    yield* setStep(ImportAccountsStep.Done)
    yield* put(importAccountsActions.accountsListed(wallets))
  } catch (e: any) {
    let payload: ErrorPayload
    if (e instanceof WalletError) {
      payload = { code: e.type, message: e.message }
    } else {
      payload = { code: WalletErrors.UnknownError, message: e.message }
    }

    yield* put(importAccountsActions.operationFailed(payload))
  }
}

function foo() {
  browser.tabs.query({ active: true, currentWindow: true }).then(
    tabs => {
      console.log('tabs', tabs)
      //   {
      //     "active": true,
      //     "audible": false,
      //     "autoDiscardable": true,
      //     "discarded": false,
      //     "groupId": -1,
      //     "height": 692,
      //     "highlighted": true,
      //     "id": 1685818669,
      //     "incognito": false,
      //     "index": 0,
      //     "mutedInfo": {
      //         "muted": false
      //     },
      //     "pinned": false,
      //     "selected": true,
      //     "status": "complete",
      //     "width": 909,
      //     "windowId": 1685818668
      // }
      browser.tabs.sendMessage(tabs[0].id, { greeting: 'hello' })
    },
    (error: any) => console.log(error),
  )
}

function* enumerateAccountsFromLedger({ payload: accounts }) {
  console.log('enumerateAccountsFromLedger', accounts)

  // yield* setStep(ImportAccountsStep.OpeningUSB)
  // let transport: Transport | undefined
  try {
    // transport = yield* getUSBTransport()
    // yield* setStep(ImportAccountsStep.LoadingAccounts)
    // const accounts = yield* call(Ledger.enumerateAccounts, transport)
    yield* setStep(ImportAccountsStep.LoadingBalances)

    const balances = yield* all(
      accounts.map(a => call(getBalance, Uint8Array.from(Object.values(a.publicKey)))),
    )
    const addresses = yield* all(
      accounts.map(a => call(publicKeyToAddress, Uint8Array.from(Object.values(a.publicKey)))),
    )
    const wallets = accounts.map((a, index) => {
      return {
        publicKey: uint2hex(Uint8Array.from(Object.values(a.publicKey))),
        path: a.path,
        address: addresses[index],
        balance: balances[index],
        // We select the first account by default
        selected: index === 0,
        type: WalletType.Ledger,
      } as ImportAccountsListAccount
    })
    // const wallets = []
    yield* setStep(ImportAccountsStep.Done)
    yield* put(importAccountsActions.accountsListed(wallets))
  } catch (e: any) {
    let payload: ErrorPayload
    if (e instanceof WalletError) {
      payload = { code: e.type, message: e.message }
    } else {
      payload = { code: WalletErrors.UnknownError, message: e.message }
    }

    yield* put(importAccountsActions.operationFailed(payload))
  } finally {
    // yield* call(foo)
    // if (transport) {
    //   yield* call([transport, transportClose])
    // }
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

export function* importAccountsSaga() {
  yield* takeEvery(importAccountsActions.enumerateAccountsFromLedger, enumerateAccountsFromLedger)
  yield* takeEvery(importAccountsActions.enumerateAccountsFromMnemonic, enumerateAccountsFromMnemonic)
}
