import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { stakingActions } from 'app/state/staking'
import * as React from 'react'
import { Provider } from 'react-redux'
import { configureAppStore } from 'store/configureStore'

import { ValidatorList } from '..'

const renderComponent = (store: any) =>
  render(
    <Provider store={store}>
      <ValidatorList />
    </Provider>,
  )

describe('<ValidatorList  />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    store = configureAppStore()
  })

  it('should match snapshot', () => {
    const component = renderComponent(store)
    store.dispatch(stakingActions.updateValidators([]))
    expect(component.container.firstChild).toMatchSnapshot()
  })

  it('should display validator details on click', async () => {
    renderComponent(store)
    store.dispatch(
      stakingActions.updateValidators([
        {
          address: 'oasis1qpc4ze5zzq3aa5mu5ttu4ku4ctp5t6x0asemymfz',
          current_rate: 0.1,
          rank: 0,
          status: 'active',
          escrow: 1000,
          name: 'test-validator',
          media: {
            email_address: 'test@test.com',
            tg_chat: 'telegram',
            twitter_acc: 'https://twitter.com/my_twitter',
            website_link: 'https://test.com',
          },
        },
      ]),
    )

    let row = screen.getByText(/test-validator/)
    expect(row).toBeVisible()
    userEvent.click(row)

    const details = await screen.findByTestId('validator-item')
    row = screen.getAllByText(/test-validator/)[0]

    expect(details).toBeVisible()
    userEvent.click(row)
    await waitFor(() => expect(details).not.toBeVisible())
  })

  it('should only display the details of a single validator', async () => {
    renderComponent(store)
    store.dispatch(
      stakingActions.updateValidators([
        {
          address: 'oasis1qpc4ze5zzq3aa5mu5ttu4ku4ctp5t6x0asemymfz',
          current_rate: 0.1,
          rank: 0,
          status: 'active',
          escrow: 1000,
          name: 'test-validator1',
          media: {
            email_address: 'test@test.com',
            tg_chat: 'telegram',
            twitter_acc: 'https://twitter.com/my_twitter',
            website_link: 'https://test.com',
          },
        },
        {
          address: 'oasis1qzyqaxestzlum26e2vdgvkerm6d9qgdp7gh2pxqe',
          current_rate: 0.2,
          rank: 1,
          status: 'inactive',
          escrow: 1000,
          name: 'test-validator2',
          media: {
            email_address: 'test@test.com',
            tg_chat: 'telegram',
            twitter_acc: 'https://twitter.com/my_twitter',
            website_link: 'https://test.com',
          },
        },
      ]),
    )

    let row = screen.getByText(/test-validator1/)
    expect(row).toBeVisible()
    userEvent.click(row)

    let details = await screen.findByTestId('validator-item')
    expect(screen.getByTestId('validator-item-name').textContent).toEqual('test-validator1')
    expect(details).toBeVisible()

    row = screen.getByText(/test-validator2/)
    userEvent.click(row)

    details = screen.getByTestId('validator-item')
    await waitFor(() =>
      expect(screen.getByTestId('validator-item-name').textContent).toEqual('test-validator2'),
    )
    expect(details).toBeVisible()
  })
})
