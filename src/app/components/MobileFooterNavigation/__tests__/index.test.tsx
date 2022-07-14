import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureAppStore } from 'store/configureStore'
import { ThemeProvider } from 'styles/theme/ThemeProvider'
import { Wallet } from 'app/state/wallet/types'

import { MobileFooterNavigation, MobileFooterNavigationProps } from '..'

const renderComponent = (store: any, { isAccountOpen, isMobile }: MobileFooterNavigationProps) =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <ThemeProvider>
          <MobileFooterNavigation isAccountOpen={isAccountOpen} isMobile={isMobile} />
        </ThemeProvider>
      </MemoryRouter>
    </Provider>,
  )

describe('<isAccountOpen />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    store = configureAppStore({
      wallet: {
        isOpen: true,
        selectedWallet: 0,
        wallets: {
          0: {
            address: 'dummy',
            id: 1,
          } as Wallet,
        },
      },
    })
  })

  it('should render component for mobile and when account is open', () => {
    renderComponent(store, { isAccountOpen: true, isMobile: true })

    expect(screen.queryByTestId('mobile-footer-navigation')).toMatchSnapshot()
  })

  it('should not render component for non mobile', () => {
    renderComponent(store, { isAccountOpen: true, isMobile: false })

    expect(screen.queryByTestId('mobile-footer-navigation')).not.toBeInTheDocument()
  })

  it('should not render component when account is not open', () => {
    renderComponent(store, { isAccountOpen: false, isMobile: true })

    expect(screen.queryByTestId('mobile-footer-navigation')).not.toBeInTheDocument()
  })
})
