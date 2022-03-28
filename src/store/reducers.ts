/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from '@reduxjs/toolkit'
import { InjectedReducersType } from 'utils/types/injector-typings'
import { createBrowserHistory } from 'history'
import { connectRouter } from 'connected-react-router'
import themeReducer from 'styles/theme/slice'

// export const history = createBrowserHistory({
//   basename: 'index.html',
// })

export const history = createBrowserHistory()

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
// export function createReducer(injectedReducers: InjectedReducersType = {}) {
//   // Initially we don't have any injectedReducers, so returning identity function to avoid the error
//   return combineReducers({
//     // ...injectedReducers,
//     ...themeReducer,
//     // router: connectRouter(history),
//   })
// }

export default function createReducer(injectedReducers = {}) {
  const rootReducer = combineReducers({
    router: connectRouter(history),
    theme: themeReducer,
    // ...injectedReducers,
  })

  return rootReducer
}
