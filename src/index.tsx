/**
 * index.tsx
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

// Use consistent styling
import 'sanitize.css/sanitize.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { App } from 'app'

import { HelmetProvider } from 'react-helmet-async'

import { configureAppStore } from 'store/configureStore'
import { OpenWalletPage } from 'app/pages/OpenWalletPage'
import { ThemeProvider } from 'styles/theme/ThemeProvider'

// Initialize languages
import './locales/i18n'

// Fonts
import './styles/main.css'
import { commonRoutes } from './routes'

const store = configureAppStore()
const MOUNT_NODE = document.getElementById('root') as HTMLElement
const router = createBrowserRouter([
  {
    path: '/*',
    element: <App />,
    children: [
      ...commonRoutes,
      {
        path: 'open-wallet/*',
        element: <OpenWalletPage />,
      },
    ],
  },
])

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
