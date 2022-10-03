import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'
import { Store } from 'webext-redux'
import { createHashRouter, RouterProvider } from 'react-router-dom'

import { ThemeProvider } from 'styles/theme/ThemeProvider'
import { App } from 'app'
import { OpenWalletPageWebExtension } from 'app/pages/OpenWalletPage/webextension'

import 'locales/i18n'
import 'sanitize.css/sanitize.css'
import 'styles/main.css'
import { commonRoutes } from './../../../src/routes'

const MOUNT_NODE = document.getElementById('root') as HTMLElement
const store = new Store()
const router = createHashRouter([
  {
    path: '/*',
    element: <App />,
    children: [
      ...commonRoutes,
      {
        path: 'open-wallet/*',
        element: <OpenWalletPageWebExtension />,
      },
    ],
  },
])

store.ready().then(() => {
  ReactDOM.render(
    <Provider store={store}>
      <ThemeProvider>
        <HelmetProvider>
          <React.StrictMode>
            <RouterProvider router={router} />
          </React.StrictMode>
        </HelmetProvider>
      </ThemeProvider>
    </Provider>,
    MOUNT_NODE,
  )
})

console.log('popup')
