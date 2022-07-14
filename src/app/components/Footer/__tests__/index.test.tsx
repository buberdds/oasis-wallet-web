import { render, screen } from '@testing-library/react'
import { ResponsiveContext } from 'grommet'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styles/theme/ThemeProvider'
import { configureAppStore } from 'store/configureStore'
import { Wallet } from 'app/state/wallet/types'

import { Footer } from '..'

jest.unmock('react-i18next')

const renderComponent = (store: any, responsiveContext: string) =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <ThemeProvider>
          <ResponsiveContext.Provider value={responsiveContext}>
            <Footer />
          </ResponsiveContext.Provider>
        </ThemeProvider>
      </MemoryRouter>
    </Provider>,
  )

describe('<Footer />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    jest.resetModules()

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

  it('should render a link with version number', () => {
    renderComponent(store, 'large')

    expect(screen.getByRole('link', { name: 'sha0000' })).toHaveAttribute(
      'href',
      'https://github.com/oasisprotocol/oasis-wallet-web/commit/sha0000000000000000000000000000000000000',
    )
  })

  it('should render backend label', () => {
    renderComponent(store, 'large')

    expect(screen.getByText(/Powered by Oasis Scan API.*/)).toBeInTheDocument()
  })

  it('should render mobile version of footer', () => {
    renderComponent(store, 'small')

    expect(screen.getByTestId('footer')).toMatchSnapshot()
  })
})
