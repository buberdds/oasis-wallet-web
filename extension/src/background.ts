import { wrapStore } from 'webext-redux'
// import { persistStore } from 'redux-persist'
// import { configureAppStore } from '../../src/store/configureStore'
import { configureAppStore } from './configureStore'
const initialState = {}
const store = configureAppStore(initialState)

// persistStore(store)
wrapStore(store)
// console.log(store)
console.log('bg')
