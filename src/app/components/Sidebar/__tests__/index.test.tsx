import { render } from '@testing-library/react'
import { ConnectedRouter } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import * as React from 'react'
import { Provider } from 'react-redux'
import { configureAppStore } from 'store/configureStore'

import { Navigation } from '..'

const renderComponent = (store: any) => {
  const history = createBrowserHistory()
  return render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Navigation />
      </ConnectedRouter>
    </Provider>,
  )
}

describe('<Navigation />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    store = configureAppStore()
    jest.resetAllMocks()
  })

  it('should match snapshot', () => {
    const component = renderComponent(store)
    expect(component.container.firstChild).toMatchSnapshot()
  })

  it.todo('should be responsive')
})
