import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { multiAccountsActions } from 'app/state/multiaccounts'
import { MultiAccountsStep } from 'app/state/multiaccounts/types'
import { walletActions } from 'app/state/wallet'
import * as React from 'react'
import { Provider, useDispatch } from 'react-redux'
import { configureAppStore } from 'store/configureStore'
import { ThemeProvider } from 'styles/theme/ThemeProvider'

import { MultiAccountsSelectionModal } from '..'

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}))

const renderComponent = (store: any, abortFunction = () => {}) =>
  render(
    <Provider store={store}>
      <ThemeProvider>
        <MultiAccountsSelectionModal abort={abortFunction} type="ledger" />
      </ThemeProvider>
    </Provider>,
  )

describe('<MultiAccountsSelectionModal  />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    store = configureAppStore()
    jest.mocked(useDispatch).mockImplementation(() => jest.fn())
  })

  afterEach(() => {
    jest.resetModules()
    jest.resetAllMocks()
    cleanup()
    document.body.innerHTML = ''
  })

  it('should match snapshot', () => {
    const component = renderComponent(store)
    expect(component.baseElement).toMatchSnapshot()
    screen.getByTestId('ledger-open-accounts')
  })

  it('should list the accounts when done', () => {
    const component = renderComponent(store)
    store.dispatch(
      multiAccountsActions.accountsListed([
        {
          address: 'oasis1qzyqaxestzlum26e2vdgvkerm6d9qgdp7gh2pxqe',
          balance: { available: '0', validator: { escrow: '0', escrow_debonding: '0' } },
          path: [44, 474, 0],
          publicKey: '00',
          selected: false,
        },
      ]),
    )

    store.dispatch(multiAccountsActions.setStep(MultiAccountsStep.Done))
    expect(component.getByText('oasis1qzyq...7gh2pxqe')).toBeInTheDocument()
  })

  it('should open the selected accounts', () => {
    const dispatchFn = jest.fn()
    jest.mocked(useDispatch).mockImplementation(() => dispatchFn)

    renderComponent(store)
    store.dispatch(
      multiAccountsActions.accountsListed([
        {
          address: 'oasis1qzyqaxestzlum26e2vdgvkerm6d9qgdp7gh2pxqe',
          balance: { available: '0', validator: { escrow: '0', escrow_debonding: '0' } },
          path: [44, 474, 0],
          publicKey: '00',
          selected: false,
        },
        {
          address: 'oasis1qqv25adrld8jjquzxzg769689lgf9jxvwgjs8tha',
          balance: { available: '0', validator: { escrow: '0', escrow_debonding: '0' } },
          path: [44, 474, 1],
          publicKey: '00',
          selected: false,
        },
      ]),
    )

    store.dispatch(multiAccountsActions.setStep(MultiAccountsStep.Done))
    userEvent.click(screen.getByText('oasis1qzyq...7gh2pxqe'))
    expect(dispatchFn).toHaveBeenLastCalledWith({ payload: 0, type: multiAccountsActions.toggleAccount.type })
    store.dispatch(multiAccountsActions.toggleAccount(0))

    userEvent.click(screen.getByTestId('ledger-open-accounts'))
    expect(dispatchFn).toHaveBeenLastCalledWith(
      expect.objectContaining({ type: walletActions.openWalletsFromLedger.type }),
    )
  })
})
