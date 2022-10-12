import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'
import { Store } from 'webext-redux'
import { createHashRouter, RouterProvider } from 'react-router-dom'

import { ThemeProvider } from 'styles/theme/ThemeProvider'
import { App } from 'app'
import { OpenWalletPageWebExtension } from 'app/pages/OpenWalletPage/webextension'
import { ConnectDevicePage } from 'app/pages/ConnectDevicePage'

import 'locales/i18n'
import 'sanitize.css/sanitize.css'
import 'styles/main.css'
import { commonRoutes } from './../../../src/routes'

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container!)
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
  {
    path: 'open-wallet/connect-device',
    element: <ConnectDevicePage />,
  },
])

store.ready().then(() => {
  root.render(
    <Provider store={store}>
      <ThemeProvider>
        <HelmetProvider>
          <React.StrictMode>
            <RouterProvider router={router} />
          </React.StrictMode>
        </HelmetProvider>
      </ThemeProvider>
    </Provider>,
  )
})

console.log('popup')
