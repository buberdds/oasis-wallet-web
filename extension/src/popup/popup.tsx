import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
// import { Store } from 'webext-redux'
import { App } from '../../../src/app/index'
import { ThemeProvider } from 'styles/theme/ThemeProvider'

import { configureAppStore } from 'store/configureStore'

import '../../../src/locales/i18n'

const store = configureAppStore()
// const store = new Store()
console.log(store)
chrome.runtime
  .connect(chrome.runtime.id, { name: 'chromex.port_name' })
  .onMessage.addListener(msg => console.info('onMessage', JSON.stringify(msg, null, 2)))

const MOUNT_NODE = document.getElementById('root') as HTMLElement

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </ThemeProvider>
  </Provider>,
  MOUNT_NODE,
)

// ReactDOM.render(<App />, MOUNT_NODE)

console.log('popup' as string)
