import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { paraTimesActions } from 'app/state/paratimes'
import { TransactionForm, TransactionTypes } from 'app/state/paratimes/types'
import { selectSelectedNetwork, selectTicker } from 'app/state/network/selectors'
import { selectAccountAvailableBalance, selectAccountIsLoading } from 'app/state/account/selectors'
import { selectAddress } from 'app/state/wallet/selectors'
import { selectParaTimes } from 'app/state/paratimes/selectors'
import { StringifiedBigInt } from 'types/StringifiedBigInt'
import { ErrorPayload, ExhaustedTypeError } from 'types/errors'
import { paraTimesConfig, RuntimeTypes, ParaTime } from '../../../config'

type AvailableParaTimesForNetwork = {
  isEvm: boolean
  value: ParaTime
}

const evmcParaTimes = Object.keys(paraTimesConfig).filter(
  key => paraTimesConfig[key as ParaTime].type === RuntimeTypes.Evm,
)

export type ParaTimesHook = {
  accountAddress: string
  accountIsLoading: boolean
  availableParaTimesForSelectedNetwork: AvailableParaTimesForNetwork[]
  balance: StringifiedBigInt | null
  balanceInBaseUnit: boolean
  isDepositing: boolean
  isEvmcParaTime: boolean
  isLoading: boolean
  isWalletEmpty: boolean
  paraTimeName: string
  resetTransactionForm: () => void
  setTransactionForm: (formValues: TransactionForm) => void
  ticker: string
  transactionError: ErrorPayload | undefined
  transactionForm: TransactionForm
  usesOasisAddress: boolean
}

const getParaTimeName = (t: TFunction, paraTime: ParaTime) => {
  switch (paraTime) {
    case ParaTime.Cipher:
      return t('paraTimes.common.cipher', 'Cipher')
    case ParaTime.Emerald:
      return t('paraTimes.common.emerald', 'Emerald')
    case ParaTime.Sapphire:
      return t('paraTimes.common.sapphire', 'Sapphire')
    default:
      throw new ExhaustedTypeError(
        t('paraTimes.validation.unsupportedParaTime', 'Unsupported ParaTime'),
        paraTime,
      )
  }
}

export const useParaTimes = (): ParaTimesHook => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const resetTransactionForm = useCallback(() => {
    dispatch(paraTimesActions.resetTransactionForm())
  }, [dispatch])
  const setTransactionForm = (formValues: TransactionForm) =>
    dispatch(paraTimesActions.setTransactionForm(formValues))
  const { balance, isLoading, transactionError, transactionForm } = useSelector(selectParaTimes)
  const accountBalance = useSelector(selectAccountAvailableBalance)
  const accountIsLoading = useSelector(selectAccountIsLoading)
  const accountAddress = useSelector(selectAddress)
  const selectedNetwork = useSelector(selectSelectedNetwork)
  const ticker = useSelector(selectTicker)
  const isDepositing = transactionForm.type !== TransactionTypes.Withdraw
  const isEvmcParaTime = evmcParaTimes.includes(transactionForm.paraTime!)
  const needsEthAddress = isDepositing && isEvmcParaTime
  const balanceInBaseUnit = isDepositing || (!isDepositing && !isEvmcParaTime)
  const paraTimeName = transactionForm.paraTime ? getParaTimeName(t, transactionForm.paraTime) : ''
  const availableParaTimesForSelectedNetwork: AvailableParaTimesForNetwork[] = (
    Object.keys(paraTimesConfig) as ParaTime[]
  )
    .filter(paratimeKey => paraTimesConfig[paratimeKey][selectedNetwork].runtimeId)
    .map(paratimeKey => ({
      isEvm: paraTimesConfig[paratimeKey].type === RuntimeTypes.Evm,
      value: paratimeKey,
    }))
  const walletBalance = !isDepositing ? balance : accountBalance

  return {
    accountAddress,
    accountIsLoading,
    availableParaTimesForSelectedNetwork,
    balance: walletBalance,
    balanceInBaseUnit,
    isDepositing,
    isEvmcParaTime,
    isLoading,
    isWalletEmpty: walletBalance === '0',
    paraTimeName,
    resetTransactionForm,
    setTransactionForm,
    ticker,
    transactionError,
    transactionForm,
    usesOasisAddress: !needsEthAddress,
  }
}
