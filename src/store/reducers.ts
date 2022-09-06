/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from '@reduxjs/toolkit'
import createWalletReducer from 'app/pages/CreateWalletPage/slice'
import accountReducer from 'app/state/account'
import fatalErrorReducer from 'app/state/fatalerror'
import multiAccountsReducer from 'app/state/multiaccounts'
import networkReducer from 'app/state/network'
import stakingReducer from 'app/state/staking'
import transactionReducer from 'app/state/transaction'
import walletReducer from 'app/state/wallet'
import themeReducer from 'styles/theme/slice'

export function createReducer() {
  const rootReducer = combineReducers({
    account: accountReducer,
    createWallet: createWalletReducer,
    fatalError: fatalErrorReducer,
    multiAccounts: multiAccountsReducer,
    network: networkReducer,
    staking: stakingReducer,
    theme: themeReducer,
    transaction: transactionReducer,
    wallet: walletReducer,
  })

  return rootReducer
}
