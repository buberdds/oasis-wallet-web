import { testSaga } from 'redux-saga-test-plan'
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
})
