import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { wrapStore, Store } from 'webext-redux'
import { App } from '../../../src/app/index'
import { ThemeProvider } from '../../../src/styles/theme/ThemeProvider'

import { configureAppStore } from '../../../src/store/configureStore'

import '../../../src/locales/i18n'

const store = configureAppStore()
// const store = new Store()
console.log(store)
chrome.runtime
  .connect(chrome.runtime.id, { name: 'chromex.port_name' })
  .onMessage.addListener(msg => console.info('onMessage', JSON.stringify(msg, null, 2)))

const MOUNT_NODE = document.getElementById('root') as HTMLElement

// store.ready().then(() => {
ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </Provider>,
  MOUNT_NODE,
)
// })

ReactDOM.render(<App />, MOUNT_NODE)

console.log('popup' as string)
