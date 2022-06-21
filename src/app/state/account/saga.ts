import { PayloadAction } from '@reduxjs/toolkit'
import { addressToPublicKey, parseRpcBalance } from 'app/lib/helpers'
import { all, call, fork, join, put, select, take, takeLatest } from 'typed-redux-saga'

import { accountActions as actions } from '.'
import { getExplorerAPIs, getOasisNic } from '../network/saga'
import { stakingActions } from '../staking'
import { transactionActions } from '../transaction'
import { selectAddress } from '../wallet/selectors'
import { selectAccountAddress } from './selectors'

/**
 * Waits for a LoadAccount action with a specific address,
 * and hydrate the state accordingly
 */
export function* loadAccount(action: PayloadAction<string>) {
  const address = action.payload

  yield* put(actions.setLoading(true))
  const nic = yield* call(getOasisNic)
  const publicKey = yield* call(addressToPublicKey, address)
  const { getAccount, getTransactionsList } = yield* call(getExplorerAPIs)

  yield* all([
    join(
      yield* fork(function* () {
        try {
          const account = yield* call(getAccount, address)
          yield put(actions.accountLoaded(account))
        } catch (apiError) {
          console.error('get account failed, continuing to RPC fallback.', apiError)
          try {
            const account = yield* call([nic, nic.stakingAccount], { owner: publicKey, height: 0 })
            const balance = parseRpcBalance(account)
            yield put(actions.accountLoaded({ address, liquid_balance: parseFloat(balance.available) }))
          } catch (rpcError) {
            console.error('get account with RPC failed, continuing without updated account.', rpcError)
            yield put(actions.accountError('' + apiError))
            return
          }
        }
      }),
    ),
    join(
      yield* fork(function* () {
        try {
          const transactions = yield* call(getTransactionsList, {
            accountId: address,
            limit: 20,
          })
          yield put(actions.transactionsLoaded(transactions))
        } catch (e) {
          console.error('get transactions list failed, continuing without updated list.', e)
          yield put(actions.transactionsError('' + e))
          return
        }
      }),
    ),
  ])

  yield* put(actions.setLoading(false))
}

/**
 * When a transaction is done, and it is related to the account we currently have in state
 * refresh the data.
 */
export function* refreshAccountOnTransaction() {
  while (true) {
    const { payload } = yield* take(transactionActions.transactionSent)
    const from = yield* select(selectAddress)
    let otherAddress: string

    if (payload.type === 'transfer') {
      otherAddress = payload.to
    } else {
      otherAddress = payload.validator
    }

    const currentAccount = yield* select(selectAccountAddress)
    if (currentAccount === from || currentAccount === otherAddress) {
      // Refresh current account
      yield* put(actions.fetchAccount(currentAccount))
      yield* put(stakingActions.fetchAccount(currentAccount))
    }
  }
}

export function* accountSaga() {
  yield* fork(refreshAccountOnTransaction)
  yield* takeLatest(actions.fetchAccount, loadAccount)
}
