import { Store, applyMiddleware } from 'webext-redux'
import createSagaMiddleware from 'redux-saga'

export default function configureAppStore() {
  const store = new Store()
  const sagaMiddleware = createSagaMiddleware({})
  const middlewares = [sagaMiddleware]
  const storeWithMiddleware = applyMiddleware(store, ...middlewares)
  return storeWithMiddleware
}
