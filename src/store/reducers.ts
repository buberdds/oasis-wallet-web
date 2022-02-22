/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from '@reduxjs/toolkit'
import { InjectedReducersType } from 'utils/types/injector-typings'
import { createBrowserHistory } from 'history'
import { connectRouter } from 'connected-react-router'
import walletReducer from 'app/state/wallet'
import stakingReducer from 'app/state/staking'

export const history = createBrowserHistory()

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export function createReducer(injectedReducers: InjectedReducersType = {}) {
  // Initially we don't have any injectedReducers, so returning identity function to avoid the error
  return combineReducers({
    ...injectedReducers,
    wallet: walletReducer,
    staking: stakingReducer,
    router: connectRouter(history),
  })
}
