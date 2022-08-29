import { expectSaga, testSaga } from 'redux-saga-test-plan'
import { Wallet, WalletState } from 'app/state/wallet/types'
import { stakingActions } from 'app/state/staking'
import { transactionActions } from 'app/state/transaction'
import { RootState } from 'types'
import { accountActions } from '.'
import {
  accountSaga,
  fetchAccount,
  refreshAccountOnTransaction,
  refreshAccountOnParaTimeTransaction,
} from './saga'

describe('Account Sagas', () => {
  test('accountSaga', () => {
    testSaga(accountSaga)
      .next()
      .fork(refreshAccountOnTransaction)
      .next()
      .fork(refreshAccountOnParaTimeTransaction)
      .next()
      .takeLatest(accountActions.fetchAccount, fetchAccount)
      .next()
      .isDone()
  })

  it('Should refresh account on paraTime transaction', () => {
    const address = 'oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk'
    return expectSaga(accountSaga)
      .withState({
        account: { address },
        wallet: {
          selectedWallet: 0,
          wallets: [
            {
              address,
            } as Partial<Wallet>,
          ],
        } as Partial<WalletState>,
      } as Partial<RootState>)
      .dispatch(transactionActions.paraTimeTransactionSent('dummyAddress'))
      .put.actionType(accountActions.fetchAccount.type)
      .put.actionType(stakingActions.fetchAccount.type)
      .silentRun(50)
  })
})
