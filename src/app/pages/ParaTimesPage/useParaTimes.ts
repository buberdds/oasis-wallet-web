import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { paraTimesActions } from 'app/state/paratimes'
import { TransactionForm, TransactionTypes } from 'app/state/paratimes/types'
import { selectSelectedNetwork } from 'app/state/network/selectors'
import { selectAccountAvailableBalance, selectAccountIsLoading } from 'app/state/account/selectors'
import { selectAddress } from 'app/state/wallet/selectors'
import { selectParaTimes } from 'app/state/paratimes/selectors'
import { paraTimesConfig, RuntimeTypes, ParaTimes } from '../../../config'

type AvailableParaTimesForNetwork = {
  isEvm: boolean
  value: ParaTimes
}

const evmcParaTimes = Object.keys(paraTimesConfig).filter(
  key => paraTimesConfig[key as ParaTimes].type === RuntimeTypes.Evm,
)

export const useParaTimes = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const resetTransactionForm = () => dispatch(paraTimesActions.resetTransactionForm())
  const setTransactionForm = (formValues: TransactionForm) =>
    dispatch(paraTimesActions.setTransactionForm(formValues))
  const { balance, isLoading, transactionForm } = useSelector(selectParaTimes)
  const accountBalance = useSelector(selectAccountAvailableBalance)
  const accountIsLoading = useSelector(selectAccountIsLoading)
  const accountAddress = useSelector(selectAddress)
  const selectedNetwork = useSelector(selectSelectedNetwork)
  const isDepositing = transactionForm.type !== TransactionTypes.Withdraw
  const isEvmcParaTime = evmcParaTimes.includes(transactionForm.paraTime!)
  const needsEthAddress = isDepositing && isEvmcParaTime
  const balanceInBaseUnit = isDepositing || (!isDepositing && !isEvmcParaTime)
  const paraTimeName = transactionForm.paraTime ? t(`paraTimes.common.${transactionForm.paraTime}`) : ''
  const availableParaTimesForSelectedNetwork: AvailableParaTimesForNetwork[] = (
    Object.keys(paraTimesConfig) as ParaTimes[]
  ).reduce(
    (acc: AvailableParaTimesForNetwork[], curr: ParaTimes) =>
      paraTimesConfig[curr][selectedNetwork].runtimeId
        ? [...acc, { isEvm: paraTimesConfig[curr].type === RuntimeTypes.Evm, value: curr }]
        : [...acc],
    [],
  )
  const walletBallance = !isDepositing ? balance : accountBalance

  return {
    accountAddress,
    accountIsLoading,
    availableParaTimesForSelectedNetwork,
    balance: walletBallance,
    balanceInBaseUnit,
    isDepositing,
    isWalletEmpty: walletBallance === '0',
    isEvmcParaTime,
    isLoading,
    paraTimeName,
    resetTransactionForm,
    transactionForm,
    setTransactionForm,
    usesOasisAddress: !needsEthAddress,
  }
}
