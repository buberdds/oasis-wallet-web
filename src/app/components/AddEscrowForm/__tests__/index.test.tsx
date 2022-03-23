import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'
import { Provider } from 'react-redux'
import { configureAppStore } from 'store/configureStore'

import { AddEscrowForm } from '..'

const renderComponent = (store: any, address: string) =>
  render(
    <Provider store={store}>
      <AddEscrowForm validatorAddress={address} />
    </Provider>,
  )

describe('<AddEscrowForm />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    store = configureAppStore()
  })

  it('should match snapshot', () => {
    const component = renderComponent(store, 'dummy-address')
    expect(component.container.firstChild).toMatchSnapshot()
  })

  it('should dispatch an addEscrow transaction', () => {
    renderComponent(store, 'dummy-address')

    userEvent.type(screen.getByTestId('amount'), '1000')
    userEvent.click(screen.getByRole('button'))

    expect(screen.getByText('errors.noOpenWallet')).toBeInTheDocument()
  })
})
