import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { AlertBox } from 'app/components/AlertBox'
import { ErrorFormatter } from 'app/components/ErrorFormatter'
import { MultiAccountsStepFormatter } from 'app/components/MultiAccountsStepFormatter'
import { ResponsiveLayer } from 'app/components/ResponsiveLayer'
import { Account } from 'app/components/Toolbar/Features/AccountSelector'
import { multiAccountsActions } from 'app/state/multiaccounts'
import { selectMultiAccounts, selectSelectedAccounts } from 'app/state/multiaccounts/selectors'
import { MultiAccountsListAccount, MultiAccountsStep } from 'app/state/multiaccounts/types'
import { walletActions } from 'app/state/wallet'
import { WalletType } from 'app/state/wallet/types'
import { Box, Button, Heading, Spinner, Text } from 'grommet'

interface MultiAccountsSelectorSelectorProps {
  accounts: MultiAccountsListAccount[]
}

function MultiAccountsSelector({ accounts }: MultiAccountsSelectorSelectorProps) {
  const dispatch = useDispatch()
  const toggleAccount = (index: number) => {
    dispatch(multiAccountsActions.toggleAccount(index))
  }

  return (
    <Box gap="small">
      {accounts.map((a, index) => (
        <Account
          index={index}
          address={a.address}
          balance={a.balance.available} // TODO: get total balance
          type={WalletType.Ledger}
          onClick={toggleAccount}
          isActive={a.selected}
          displayCheckbox={true}
          details={a.path.join('/')}
          key={index}
        />
      ))}
    </Box>
  )
}

interface MultiAccountsSelectionModalProps {
  abort: () => void
  type: 'mnemonic' | 'ledger'
}

export function MultiAccountsSelectionModal(props: MultiAccountsSelectionModalProps) {
  const { t } = useTranslation()
  const multiaccounts = useSelector(selectMultiAccounts)
  const error = multiaccounts.error
  const selectedAccounts = useSelector(selectSelectedAccounts)
  const dispatch = useDispatch()

  const openAccounts = () => {
    dispatch(
      props.type === 'ledger'
        ? walletActions.openWalletsFromLedger()
        : walletActions.openWalletFromMnemonic(),
    )
  }

  useEffect(() => {
    return () => {
      dispatch(multiAccountsActions.clear())
    }
  }, [dispatch])

  const cancelDisabled = multiaccounts.step === MultiAccountsStep.Done || error ? false : true
  const confirmDisabled = multiaccounts.step !== MultiAccountsStep.Done || selectedAccounts.length === 0

  return (
    <ResponsiveLayer onEsc={props.abort} onClickOutside={props.abort} modal background="background-front">
      <Box width="750px" pad="medium">
        <Heading size="1" margin={{ bottom: 'medium', top: 'none' }}>
          {t('openWallet.multiaccounts.selectWallets', 'Select accounts to open')}
        </Heading>
        {multiaccounts.step && multiaccounts.step !== MultiAccountsStep.Done && (
          <Box direction="row" gap="medium" alignContent="center">
            <Spinner size="medium" />
            <Box alignSelf="center">
              <Text size="xlarge">
                <MultiAccountsStepFormatter step={multiaccounts.step} />
              </Text>
            </Box>
          </Box>
        )}
        {multiaccounts.step && multiaccounts.step === MultiAccountsStep.Done && (
          <Box>
            <MultiAccountsSelector accounts={multiaccounts.accounts} />
          </Box>
        )}
        {error && (
          <AlertBox color="status-error">
            <ErrorFormatter code={error.code} message={error.message} />
          </AlertBox>
        )}
        <Box direction="row" gap="small" alignSelf="end" pad={{ top: 'large' }}>
          <Button
            secondary
            label={t('common.cancel', 'Cancel')}
            onClick={props.abort}
            disabled={cancelDisabled}
          />
          <Button
            primary
            data-testid="ledger-open-accounts"
            label={t('openWallet.multiaccounts.openWallets', 'Open')}
            onClick={openAccounts}
            alignSelf="end"
            disabled={confirmDisabled}
          />
        </Box>
      </Box>
    </ResponsiveLayer>
  )
}
