import { Signer } from '@oasisprotocol/client/dist/signature'
import * as oasis from '@oasisprotocol/client'
import { delay } from 'typed-redux-saga'
import * as oasisRT from '@oasisprotocol/client-rt'
import { PayloadAction } from '@reduxjs/toolkit'
import { hex2uint, isValidAddress, uint2bigintString } from 'app/lib/helpers'
import { LedgerSigner } from 'app/lib/ledger'
import BigNumber from 'bignumber.js'
import { OasisTransaction, signerFromPrivateKey, TW } from 'app/lib/transaction'
import { call, put, race, select, take, takeEvery } from 'typed-redux-saga'
import { ErrorPayload, ExhaustedTypeError, WalletError, WalletErrors } from 'types/errors'
import { parseRoseStringToBaseUnitString } from 'app/lib/helpers'

import { transactionActions } from '.'
import { sign } from '../ledger/saga'
import { getOasisNic } from '../network/saga'
import { selectAccountAllowances } from '../account/selectors'
import { selectChainContext } from '../network/selectors'
import { selectActiveWallet } from '../wallet/selectors'
import { Wallet, WalletType } from '../wallet/types'
import { selectAccount } from '../account/selectors'
import { TransactionPayload, TransactionStep } from './types'

export function* transactionSaga() {
  yield* takeEvery(transactionActions.sendFooTransaction, doTransaction)
  yield* takeEvery(transactionActions.sendTransaction, doTransaction)
  yield* takeEvery(transactionActions.addEscrow, doTransaction)
  yield* takeEvery(transactionActions.reclaimEscrow, doTransaction)
}

function* setStep(step: TransactionStep) {
  yield* put(transactionActions.setStep(step))
}

/**
 * When we are previewing a transaction, await either a confirm action,
 * or an abort action.
 */
function* expectConfirmation() {
  const { confirm } = yield* race({
    confirm: take(transactionActions.confirmTransaction),
    abort: take(transactionActions.abortTransaction),
  })

  if (confirm) {
    return true
  } else {
    return false
  }
}

/**
 * Yields the appropriate signer for the currently active wallet
 */
function* getSigner() {
  const wallet = yield* select(selectActiveWallet)
  if (!wallet) {
    throw new WalletError(WalletErrors.NoOpenWallet, 'Cannot send transaction without an active wallet')
  }

  const privateKey = wallet.privateKey!

  let signer: Signer | LedgerSigner
  if (wallet.type === WalletType.PrivateKey || wallet.type === WalletType.Mnemonic) {
    const bytes = hex2uint(privateKey!)
    signer = yield* call(signerFromPrivateKey, bytes)
  } else if (wallet.type === WalletType.Ledger) {
    signer = new LedgerSigner(wallet)
  } else {
    throw new ExhaustedTypeError('Invalid wallet type', wallet.type)
  }

  return signer
}

function* prepareTransfer(signer: Signer, amount: bigint, to: string) {
  const nic = yield* call(getOasisNic)

  yield* call(assertWalletIsOpen)
  yield* call(assertValidAddress, to)
  yield* call(assertSufficientBalance, amount)
  yield* call(assertRecipientNotSelf, to)

  return yield* call(OasisTransaction.buildTransfer, nic, signer as Signer, to, amount)
}

function* prepareStakingAllowTransfer(signer: Signer, amount: bigint, to: string) {
  const nic = yield* call(getOasisNic)

  yield* call(assertWalletIsOpen)
  yield* call(assertValidAddress, to)
  yield* call(assertSufficientBalance, amount)
  yield* call(assertRecipientNotSelf, to)

  return yield* call(OasisTransaction.buildStakingAllowTransfer, nic, signer as Signer, to, amount)
}

export async function getEvmBech32Address(evmAddress: string) {
  const evmBytes = oasis.misc.fromHex(evmAddress.replace('0x', ''))
  const address = await oasis.address.fromData(
    oasisRT.address.V0_SECP256K1ETH_CONTEXT_IDENTIFIER,
    oasisRT.address.V0_SECP256K1ETH_CONTEXT_VERSION,
    evmBytes,
  )
  const bech32Address = oasisRT.address.toBech32(address)
  return bech32Address
}

export async function getRuntimeAddress(runtimeID) {
  let address = await oasis.staking.addressFromRuntimeID(oasis.misc.fromHex(runtimeID))
  let bech32Address = oasis.staking.addressToBech32(address).toLowerCase()
  return bech32Address
}

async function foo() {
  return oasis.staking.addressToBech32(
    await oasis.staking.addressFromRuntimeID(
      oasis.misc.fromHex('000000000000000000000000000000000000000000000000e2eaa99fc008f87f'),
    ),
  )
}
function* prepareToParatime(signer: Signer, amount: bigint, to: string, from: string) {
  const nic = yield* call(getOasisNic)
  yield* call(assertWalletIsOpen)
  //yield* call(assertValidAddress, to) // TODO: validate 0x address
  yield* call(assertSufficientBalance, amount)
  yield* call(assertRecipientNotSelf, to)

  const allowances = yield* select(selectAccountAllowances)
  const runtimeAddress = yield* call(
    getRuntimeAddress,
    '000000000000000000000000000000000000000000000000e2eaa99fc008f87f',
  )
  const allowance = allowances.find(item => item.address === runtimeAddress)?.amount || 0
  const allowanceDifference = new BigNumber(amount).minus(allowance).toString()

  if (new BigNumber(allowanceDifference).gte(0)) {
    const toAddress = yield* call(foo)
    console.log(' start stakeAllow')
    yield* put(
      transactionActions.sendFooTransaction({
        type: 'stakingAllow',
        amount: parseRoseStringToBaseUnitString(allowanceDifference),
        to: toAddress,
      }),
    )
    yield take(transactionActions.transactionSent)
  }
  console.log(' start buildToParatime')
  return yield* call(OasisTransaction.buildToParatime, nic, signer as Signer, to, from, amount)
}

function* prepareAddEscrow(signer: Signer, amount: bigint, validator: string) {
  const nic = yield* call(getOasisNic)

  yield* call(assertWalletIsOpen)
  yield* call(assertValidAddress, validator)
  yield* call(assertSufficientBalance, amount)

  return yield* call(OasisTransaction.buildAddEscrow, nic, signer as Signer, validator, amount)
}

function* prepareReclaimEscrow(signer: Signer, shares: bigint, validator: string) {
  const nic = yield* call(getOasisNic)

  yield* call(assertWalletIsOpen)
  yield* call(assertValidAddress, validator)

  return yield* call(OasisTransaction.buildReclaimEscrow, nic, signer as Signer, validator, shares)
}

/**
 * Generate transaction, sign, push to node
 *
 * Build the transaction (and validate it client-side)
 * Wait for either confirm or cancel, exit saga on cancel
 */
export function* doTransaction(action: PayloadAction<TransactionPayload>) {
  const wallet = yield* select(selectActiveWallet)
  const nic = yield* call(getOasisNic)
  const chainContext = yield* select(selectChainContext)

  try {
    yield* setStep(TransactionStep.Building)

    yield* call(assertWalletIsOpen)
    const activeWallet = wallet as Wallet
    const signer = yield* getSigner()

    let tw: TW<any>
    switch (action.payload.type) {
      case 'transfer':
        tw = yield* call(prepareTransfer, signer as Signer, BigInt(action.payload.amount), action.payload.to)
        break

      case 'addEscrow':
        tw = yield* call(
          prepareAddEscrow,
          signer as Signer,
          BigInt(action.payload.amount),
          action.payload.validator,
        )
        break

      case 'reclaimEscrow':
        tw = yield* call(
          prepareReclaimEscrow,
          signer as Signer,
          BigInt(action.payload.shares),
          action.payload.validator,
        )
        break

      case 'toParatime':
        tw = yield* call(
          prepareToParatime,
          signer as Signer,
          BigInt(action.payload.amount),
          action.payload.to,
          action.payload.from,
        )
        break

      case 'stakingAllow':
        tw = yield* call(
          prepareStakingAllowTransfer,
          signer as Signer,
          BigInt(action.payload.amount),
          action.payload.to,
        )
        break

      default:
        throw new ExhaustedTypeError('Unsupported transaction type', action.payload)
    }

    if (action.payload.type !== 'stakingAllow') {
      let fee
      let gas
      if (action.payload.type === 'toParatime') {
        fee = uint2bigintString(tw.transaction.ai.fee?.amount!)
        gas = BigInt(tw.transaction.ai.fee?.gas!).toString()
      } else {
        fee = uint2bigintString(tw.transaction.fee?.amount!)
        gas = BigInt(tw.transaction.fee?.gas!).toString()
      }

      yield* put(
        transactionActions.updateTransactionPreview({
          transaction: action.payload,
          fee,
          gas,
        }),
      )

      yield* setStep(TransactionStep.Preview)
      const confirmed = yield* expectConfirmation()
      if (!confirmed) {
        yield* put(transactionActions.clearTransaction())
        return
      }
    }

    // yield delay(5000)
    yield* setStep(TransactionStep.Signing)

    if (activeWallet.type === WalletType.Ledger) {
      yield* call(sign, signer as LedgerSigner, tw)
    } else {
      /* if ParaTime */

      // const consensusChainContext = yield* call(getChainContext, nic)
      // yield* call(OasisTransaction.sign, /*chainContext*/ consensusChainContext, signer as Signer, tw)
      yield* call(
        action.payload.type === 'toParatime' ? OasisTransaction.signParaTime : OasisTransaction.sign,
        chainContext,
        signer as Signer,
        tw,
      )
    }

    yield* setStep(TransactionStep.Submitting)
    yield* call(OasisTransaction.submit, nic, tw)

    // Notify that the transaction was a success
    yield* put(transactionActions.transactionSent(action.payload))
  } catch (e: any) {
    let payload: ErrorPayload
    if (e instanceof WalletError) {
      payload = { code: e.type, message: e.message }
    } else {
      payload = { code: WalletErrors.UnknownError, message: e.message }
    }

    yield* put(transactionActions.transactionFailed(payload))
  }
}

function* assertWalletIsOpen() {
  const wallet = yield* select(selectActiveWallet)

  if (!wallet) {
    throw new WalletError(WalletErrors.NoOpenWallet, 'Cannot send transaction without an active wallet')
  }
}

function assertValidAddress(address: string) {
  if (!isValidAddress(address)) {
    throw new WalletError(WalletErrors.InvalidAddress, 'Invalid address')
  }
}

function* assertSufficientBalance(amount: bigint) {
  const wallet = yield* select(selectActiveWallet)

  const balance = BigInt(wallet!.balance.available)
  if (amount > balance) {
    throw new WalletError(WalletErrors.InsufficientBalance, 'Insufficient balance')
  }
}

function* assertRecipientNotSelf(recipient: string) {
  const wallet = yield* select(selectActiveWallet)

  if (wallet!.address === recipient) {
    throw new WalletError(WalletErrors.CannotSendToSelf, 'Cannot send to your own account')
  }
}
