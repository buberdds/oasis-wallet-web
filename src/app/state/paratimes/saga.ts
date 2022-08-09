import { call, put, select, takeLatest } from 'typed-redux-saga'
import { PayloadAction } from '@reduxjs/toolkit'
import * as oasis from '@oasisprotocol/client'
import { accounts, token } from '@oasisprotocol/client-rt'
import { getEvmBech32Address, privateToHexAddress } from 'app/lib/eth-helpers'
import { WalletError, WalletErrors } from 'types/errors'
import { paraTimesActions } from '.'
import { EvmcBalancePayload, OasisAddressBalancePayload } from './types'
import { selectSelectedNetwork } from '../network/selectors'
import { getOasisNic } from '../network/saga'
import { paraTimesConfig, ParaTimes } from '../../../config'

async function getRuntimeBalance(address: string, runtimeId: string, oasisClient: oasis.client.NodeInternal) {
  const CONSENSUS_RT_ID = oasis.misc.fromHex(runtimeId)
  const accountsWrapper = new accounts.Wrapper(CONSENSUS_RT_ID)
  const accountBalances = await accountsWrapper
    .queryBalances()
    .setArgs({
      address: await oasis.staking.addressFromBech32(address),
    })
    .query(oasisClient)
    .catch(error => {
      throw new WalletError(WalletErrors.UnknownGrpcError, error)
    })
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

export function* fetchBalance(oasisAddress: string, paraTime: ParaTimes) {
  try {
    const nic = yield* call(getOasisNic)
    const selectedNetwork = yield* select(selectSelectedNetwork)
    const balance: any = yield* call(
      getRuntimeBalance,
      oasisAddress,
      paraTimesConfig[paraTime][selectedNetwork].runtimeId,
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
    const address = privateToHexAddress(privateKey)
    const oasisAddress = yield* call(getEvmBech32Address, address)
    yield* call(fetchBalance, oasisAddress, paraTime)
  } catch (error: any) {
    throw new WalletError(WalletErrors.ParaTimesUnknownError, error)
  }
}

export function* fetchBalanceUsingOasisAddress({
  payload: { address, paraTime },
}: PayloadAction<OasisAddressBalancePayload>) {
  try {
    yield* call(fetchBalance, address, paraTime)
  } catch (error: any) {
    throw new WalletError(WalletErrors.ParaTimesUnknownError, error)
  }
}
export function* paraTimesSaga() {
  yield* takeLatest(paraTimesActions.fetchBalanceUsingOasisAddress, fetchBalanceUsingOasisAddress)
  yield* takeLatest(paraTimesActions.fetchBalanceUsingEthPrivateKey, fetchBalanceUsingEthPrivateKey)
}
