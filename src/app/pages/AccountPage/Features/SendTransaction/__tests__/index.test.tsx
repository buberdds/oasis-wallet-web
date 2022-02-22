import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'
import { Provider } from 'react-redux'
import { configureAppStore } from 'store/configureStore'
import { ModalProvider } from 'app/components/Modal'
import { SendTransaction } from '..'

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: str => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    }
  },
}))

const renderComponent = store =>
  render(
    <Provider store={store}>
      <ModalProvider>
        <SendTransaction />
      </ModalProvider>
    </Provider>,
  )

describe('<SendTransaction />', () => {
  let store: ReturnType<typeof configureAppStore>
  const staking = {
    debondingDelegations: [],
    delegations: [],
    selectedValidatorDetails: null,
    loading: false,
    validators: [
      {
        address: 'validatorAddress',
        commission_schedule: { bounds: [], rates: [] },
        name: 'stakefish',
        escrow: 336531104450242940,
        status: 'inactive',
        media: undefined,
        rank: 1,
      },
    ],
    updateValidatorsError: null,
  }

  beforeEach(() => {
    store = configureAppStore({ staking })
  })

  it('should dispatch sendTransaction action on submit', () => {
    const spy = jest.spyOn(store, 'dispatch')
    renderComponent(store)

    userEvent.type(screen.getByPlaceholderText('account.sendTransaction.enterAddress'), 'walletAddress')
    userEvent.type(screen.getByPlaceholderText('0'), '10')
    userEvent.click(screen.getByRole('button'))

    expect(spy).toHaveBeenCalledWith({
      payload: {
        amount: 10,
        to: 'walletAddress',
        type: 'transfer',
      },
      type: 'transaction/sendTransaction',
    })
  })

  it('should interrupt dispatch sendTransaction action with a confirmation dialog', () => {
    const spy = jest.spyOn(store, 'dispatch')
    renderComponent(store)

    userEvent.type(screen.getByPlaceholderText('account.sendTransaction.enterAddress'), 'validatorAddress')
    userEvent.type(screen.getByPlaceholderText('0'), '10')
    userEvent.click(screen.getByRole('button'))

    expect(screen.getByText(/confirmSendingToValidator.title/)).toBeInTheDocument()
    expect(screen.getByText(/confirmSendingToValidator.description/)).toBeInTheDocument()
    userEvent.click(screen.getByRole('button', { name: 'common.confirm' }))

    expect(spy).toHaveBeenCalledWith({
      payload: {
        amount: 10,
        to: 'validatorAddress',
        type: 'transfer',
      },
      type: 'transaction/sendTransaction',
    })
  })
})
