import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { useSelector } from 'react-redux'
import { when } from 'jest-when'
import { selectParaTimes } from 'app/state/paratimes/selectors'
import { TransactionFormSteps } from 'app/state/paratimes/types'
import { selectIsAddressInWallet } from 'app/state/selectIsAddressInWallet'
import { useParaTimes, ParaTimesHook } from './../useParaTimes'
import { ParaTimes } from '..'

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}))
jest.mock('./../useParaTimes')

describe('<ParaTimes />', () => {
  const mockUseParaTimesResult = {} as ParaTimesHook

  beforeEach(() => {
    when(useSelector as any)
      .calledWith(selectParaTimes)
      .mockReturnValue({
        transactionFormStep: TransactionFormSteps.TransferType,
      })
      .calledWith(selectIsAddressInWallet)
      .mockReturnValue(true)
  })

  it('should render a form and clear form on unmount', () => {
    const clearTransactionForm = jest.fn()
    jest.mocked(useParaTimes).mockReturnValue({ ...mockUseParaTimesResult, clearTransactionForm })
    const { unmount } = render(<ParaTimes />)

    expect(screen.getByText('paraTimes.transfers.deposit')).toBeInTheDocument()
    expect(screen.getByText('paraTimes.transfers.withdraw')).toBeInTheDocument()

    unmount()

    expect(clearTransactionForm).toHaveBeenCalled()
  })
})
