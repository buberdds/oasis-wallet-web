import { call, put, select, takeLatest } from 'typed-redux-saga'
import { PayloadAction } from '@reduxjs/toolkit'
import * as oasis from '@oasisprotocol/client'
import { accounts, token } from '@oasisprotocol/client-rt'
import { getEvmBech32Address, privateToEthAddress } from 'app/lib/eth-helpers'
import { submitParaTimeTransaction } from 'app/state/transaction/saga'
import { WalletError, WalletErrors } from 'types/errors'
import { paraTimesActions } from '.'
import { EvmcBalancePayload, OasisAddressBalancePayload, Runtime } from './types'
import { selectParaTimes } from '../paratimes/selectors'
import { selectSelectedNetwork } from '../network/selectors'
import { getOasisNic } from '../network/saga'
import { paraTimesConfig, ParaTime } from '../../../config'

export async function getRuntimeBalance(address: string, runtimeId: string, nic: oasis.client.NodeInternal) {
  const accountsWrapper = new accounts.Wrapper(oasis.misc.fromHex(runtimeId))
  const accountBalances = await accountsWrapper
    .queryBalances()
    .setArgs({
      address: await oasis.staking.addressFromBech32(address),
    })
    .query(nic)
  let nativeDenominationBalanceBI = 0n
  if (accountBalances.balances) {
    const nativeDenominationHex = oasis.misc.toHex(token.NATIVE_DENOMINATION)
    for (const [denomination, amount] of accountBalances.balances) {
      const denominationHex = oasis.misc.toHex(denomination)
      if (denominationHex === nativeDenominationHex) {
        nativeDenominationBalanceBI = oasis.quantity.toBigInt(amount)
        break
      }
    }
  }
  return nativeDenominationBalanceBI
}

export function* fetchBalance(oasisAddress: string, paraTime: ParaTime) {
  try {
    const nic = yield* call(getOasisNic)
    const selectedNetwork = yield* select(selectSelectedNetwork)
    const balance = yield* call(
      getRuntimeBalance,
      oasisAddress,
      paraTimesConfig[paraTime][selectedNetwork].runtimeId!,
      nic,
    )
    yield* put(paraTimesActions.balanceLoaded(balance.toString()))
  } catch (error: any) {
    throw new WalletError(WalletErrors.ParaTimesUnknownError, error)
  }
}

export function* fetchBalanceUsingEthPrivateKey({
  payload: { privateKey, paraTime },
}: PayloadAction<EvmcBalancePayload>) {
  try {
    const address = privateToEthAddress(privateKey)
    const oasisAddress = yield* call(getEvmBech32Address, address)
    yield* call(fetchBalance, oasisAddress, paraTime)
  } catch (error: any) {
    throw new WalletError(WalletErrors.ParaTimesUnknownError, error)
  }
}

export function* fetchBalanceUsingOasisAddress({
  payload: { address, paraTime },
}: PayloadAction<OasisAddressBalancePayload>) {
  yield* call(fetchBalance, address, paraTime)
}

export function* submitTransaction() {
  try {
    const selectedNetwork = yield* select(selectSelectedNetwork)
    const { transactionForm } = yield* select(selectParaTimes)
    const paraTimeConfig = paraTimesConfig[transactionForm.paraTime!]
    const runtime: Runtime = {
      address: paraTimeConfig[selectedNetwork].address!,
      id: paraTimeConfig[selectedNetwork].runtimeId!,
      decimals: paraTimeConfig.decimals,
    }

    yield* call(submitParaTimeTransaction, runtime, transactionForm.amount, transactionForm.recipient)
    yield* put(paraTimesActions.transactionSubmitted())
  } catch (error: any) {
    throw new WalletError(WalletErrors.ParaTimesUnknownError, error)
  }
}

export function* paraTimesSaga() {
  yield* takeLatest(paraTimesActions.submitTransaction, submitTransaction)
  yield* takeLatest(paraTimesActions.fetchBalanceUsingOasisAddress, fetchBalanceUsingOasisAddress)
  yield* takeLatest(paraTimesActions.fetchBalanceUsingEthPrivateKey, fetchBalanceUsingEthPrivateKey)
}
