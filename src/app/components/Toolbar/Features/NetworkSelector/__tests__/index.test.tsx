import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { useSelector, useDispatch } from 'react-redux'
import userEvent from '@testing-library/user-event'
import { when } from 'jest-when'
import { networkActions } from 'app/state/network'
import { selectSelectedNetwork } from 'app/state/network/selectors'
import { NetworkSelector } from '..'

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}))

describe('<NetworkSelector  />', () => {
  const mockDispatch = jest.fn()

  beforeEach(() => {
    when(useSelector as any)
      .calledWith(selectSelectedNetwork)
      .mockReturnValue('local')
  })

  it('should match snapshot', () => {
    const component = render(<NetworkSelector />)
    expect(component.container.firstChild).toMatchSnapshot()
  })

  it('should allow switching network', async () => {
    jest.mocked(useDispatch).mockImplementation(() => mockDispatch)
    const component = render(<NetworkSelector />)
    expect(component.getByTestId('active-network')).toContainHTML('toolbar.networks.local')
    await userEvent.click(screen.getByTestId('network-selector'))

    expect(await screen.findByText('toolbar.networks.testnet')).toBeInTheDocument()
    await userEvent.click(screen.getByText('toolbar.networks.testnet'))

    expect(mockDispatch).toHaveBeenCalledWith({
      payload: 'testnet',
      type: 'network/selectNetwork',
    } as ReturnType<typeof networkActions.selectNetwork>)
  })
})
