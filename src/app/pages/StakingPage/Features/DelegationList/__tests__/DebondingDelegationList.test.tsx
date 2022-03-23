import userEvent from '@testing-library/user-event'
import { screen, waitFor } from '@testing-library/react'
import * as React from 'react'
import { render } from '@testing-library/react'

import { Provider } from 'react-redux'
import { DebondingDelegationList } from '../DebondingDelegationList'
import { configureAppStore } from 'store/configureStore'
import { stakingActions } from 'app/state/staking'

const renderComponent = (store: any) =>
  render(
    <Provider store={store}>
      <DebondingDelegationList />
    </Provider>,
  )

describe('<DebondingDelegationList  />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    store = configureAppStore()
  })

  it('should match snapshot', () => {
    const component = renderComponent(store)
    store.dispatch(
      stakingActions.updateDebondingDelegations([
        {
          epoch: 100,
          amount: '100',
          shares: '100',
          validatorAddress: 'test-validator',
          validator: {
            current_rate: 0.1,
            address: 'test-validator',
            rank: 1,
            status: 'active',
            name: 'test-validator',
          },
        },
      ]),
    )

    expect(component).toMatchSnapshot()
  })

  it('should expand and display the delegation on click', async () => {
    renderComponent(store)
    store.dispatch(
      stakingActions.updateDebondingDelegations([
        {
          epoch: 100,
          amount: '100',
          shares: '100',
          validatorAddress: 'oasis1qqv25adrld8jjquzxzg769689lgf9jxvwgjs8tha',
          validator: {
            address: 'oasis1qqv25adrld8jjquzxzg769689lgf9jxvwgjs8tha',
            current_rate: 0,
            rank: 1,
            status: 'active',
            name: 'test-validator1',
          },
        },
        {
          amount: '50',
          shares: '50',
          validatorAddress: 'oasis1qq2vzcvxn0js5unsch5me2xz4kr43vcasv0d5eq4',
          epoch: 100,
        },
      ]),
    )

    let row = screen.getByText(/test-validator1/)
    expect(row).toBeVisible()
    userEvent.click(row)

    const details = await screen.findByTestId('validator-item')
    row = screen.getAllByText(/test-validator1/)[0]

    expect(details).toBeVisible()
    userEvent.click(row)
    await waitFor(() => expect(details).not.toBeVisible())
  })
})
