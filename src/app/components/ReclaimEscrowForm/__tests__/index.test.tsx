import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'
import { Provider } from 'react-redux'
import { configureAppStore } from 'store/configureStore'

import { ReclaimEscrowForm } from '..'

const renderComponent = (store: any, address: string, maxAmount: string, shares: string) =>
  render(
    <Provider store={store}>
      <ReclaimEscrowForm address={address} maxAmount={maxAmount} shares={shares} />
    </Provider>,
  )

describe('<ReclaimEscrowForm />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    store = configureAppStore()
    jest.resetAllMocks()
  })

  it('should match snapshot', () => {
    const component = renderComponent(store, 'dummy-address', '1000', '1000')
    expect(component.container.firstChild).toMatchSnapshot()
  })

  it('should error without an open wallet', () => {
    renderComponent(store, 'dummy-address', '1000', '1000')

    userEvent.type(screen.getByTestId('amount'), '1000')
    userEvent.click(screen.getByRole('button'))

    expect(screen.getByText('errors.noOpenWallet')).toBeInTheDocument()
  })

  it('should display the number of shares', () => {
    renderComponent(store, 'dummy-address', '1000', '1000')

    expect(screen.queryByTestId('numberOfShares')).toBeNull()
    userEvent.type(screen.getByTestId('amount'), '500')
    expect(screen.getByTestId('numberOfShares')).toBeInTheDocument()
  })

  it('should submit the transaction', () => {
    const spy = jest.spyOn(store, 'dispatch')
    renderComponent(store, 'dummy-address', '2000', '1000')

    userEvent.type(screen.getByTestId('amount'), '500')
    userEvent.click(screen.getByRole('button'))

    expect(spy).toHaveBeenCalledWith({
      payload: {
        amount: 500,
        shares: 250,
        type: 'reclaimEscrow',
        validator: 'dummy-address',
      },
      type: 'transaction/reclaimEscrow',
    })
  })
})
