/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */
import { Box, Main, ResponsiveContext } from 'grommet'
import * as React from 'react'
import { useContext } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Route, Routes } from 'react-router-dom'
import { FatalErrorHandler } from './components/FatalErrorHandler'
import { Footer } from './components/Footer'
import { Navigation } from './components/Sidebar'
import { Toolbar } from './components/Toolbar'
import { AccountPage } from './pages/AccountPage'
import { CreateWalletPage } from './pages/CreateWalletPage'
import { HomePage } from './pages/HomePage'
import { OpenWalletPage } from './pages/OpenWalletPage'
import { ModalProvider } from './components/Modal'
import { useRouteRedirects } from './useRouteRedirects'
import { AnimatePresence } from 'framer-motion'

export function App() {
  useRouteRedirects()
  const { i18n } = useTranslation()
  const size = useContext(ResponsiveContext)

  return (
    <ModalProvider>
      <Helmet
        titleTemplate="%s - Oasis Wallet"
        defaultTitle="Oasis Wallet"
        htmlAttributes={{ lang: i18n.language }}
      >
        <meta name="description" content="A wallet for Oasis" />
      </Helmet>
      <Box direction="row-responsive" background="background-back" fill style={{ minHeight: '100vh' }}>
        <Navigation />
        <Box flex pad={{ top: size === 'small' ? '64px' : undefined }}>
          <Main>
            <FatalErrorHandler />
            <Toolbar />
            <AnimatePresence>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/create-wallet" element={<CreateWalletPage />} />
                <Route path="/open-wallet/*" element={<OpenWalletPage />} />
                <Route path="/account/:address/*" element={<AccountPage />} />
              </Routes>
            </AnimatePresence>
            <Footer />
          </Main>
        </Box>
      </Box>
    </ModalProvider>
  )
}
