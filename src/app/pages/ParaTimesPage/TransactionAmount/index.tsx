import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Box, Button, Form, FormField, Text, TextInput } from 'grommet'
import { Trans, useTranslation } from 'react-i18next'

import {
  formatBaseUnitsAsRose,
  formatGweiAsWrose,
  isAmountGreaterThan,
  isEvmcAmountGreaterThan,
} from 'app/lib/helpers'
import { paraTimesActions } from 'app/state/paratimes'
import { AlertBox } from 'app/components/AlertBox'
import { AmountFormatter } from '../../../components/AmountFormatter'
import { ParaTimeContent } from '../ParaTimeContent'
import { ParaTimeFormFooter } from '../ParaTimeFormFooter'
import { useParaTimes } from '../useParaTimes'
import { useParaTimesNavigation } from '../useParaTimesNavigation'
import { ParaTimes } from '../../../../config'

export const TransactionAmount = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const {
    balance,
    balanceInBaseUnit,
    isDepositing,
    isEvmcParaTime,
    isLoading,
    isWalletEmpty,
    paraTimeName,
    setTransactionForm,
    transactionForm,
  } = useParaTimes()
  const { navigateToRecipient, navigateToConfirmation } = useParaTimesNavigation()
  const formatter = balanceInBaseUnit ? formatBaseUnitsAsRose : formatGweiAsWrose
  const validator = balanceInBaseUnit ? isAmountGreaterThan : isEvmcAmountGreaterThan
  const disabled = !isLoading && isWalletEmpty

  useEffect(() => {
    if (isDepositing) {
      return
    }

    dispatch(
      isEvmcParaTime
        ? paraTimesActions.fetchBalanceUsingEthPrivateKey({
            privateKey: transactionForm.privateKey,
            paraTime: transactionForm.paraTime as ParaTimes,
          })
        : paraTimesActions.fetchBalanceUsingOasisAddress({
            address: transactionForm.recipient,
            paraTime: transactionForm.paraTime as ParaTimes,
          }),
    )
  }, [
    dispatch,
    isDepositing,
    isEvmcParaTime,
    transactionForm.paraTime,
    transactionForm.recipient,
    transactionForm.privateKey,
  ])

  return (
    <ParaTimeContent
      description={
        <Trans
          i18nKey="paraTimes.amount.description"
          t={t}
          values={{
            actionType: isDepositing
              ? t('paraTimes.amount.receiving', 'to the receiving')
              : t('paraTimes.amount.withdrawing', 'from the withdrawing'),
            isEvmc: isEvmcParaTime ? t('paraTimes.common.evmc', '(EVMc)') : '',
            paraTime: paraTimeName,
          }}
          defaults='Please enter the amount of ROSE tokens you wish to transfer {{actionType}} wallet on the <strong>{{paraTime}}</strong> {{isEvmc}} ParaTime and then click "Next"'
        />
      }
      isLoading={isLoading}
    >
      {disabled && (
        <AlertBox color="status-warning">
          {t('paraTimes.amount.emptyWallet', 'The wallet is empty. There is nothing to withdraw.')}
        </AlertBox>
      )}

      <Box margin={{ bottom: 'medium' }}>
        <Form
          messages={{ required: t('paraTimes.validation.required', 'Field is required') }}
          onChange={nextValue => setTransactionForm(nextValue)}
          onSubmit={navigateToConfirmation}
          value={transactionForm}
        >
          <Box margin={{ bottom: 'small' }}>
            <Box width="medium" direction="row" margin="none" align="center" style={{ position: 'relative' }}>
              <FormField
                name="amount"
                style={{ width: '100%' }}
                required
                validate={amount =>
                  validator(amount, balance!)
                    ? {
                        message: t(
                          'paraTimes.validation.invalidAmount',
                          'Amount is bigger than available balance',
                        ),
                        status: 'error',
                      }
                    : undefined
                }
              >
                <TextInput disabled={disabled} name="amount" placeholder="0" value={transactionForm.amount} />
              </FormField>
              {balance && (
                <Button
                  disabled={disabled}
                  style={{
                    fontWeight: 'bold',
                    zIndex: 2,
                    position: 'absolute',
                    top: '15px',
                    right: 0,
                  }}
                  plain
                  label="MAX"
                  onClick={() => setTransactionForm({ ...transactionForm, amount: formatter(balance) })}
                />
              )}
            </Box>

            <Box align="end">
              <Text weight="bolder" size="small">
                {t('paraTimes.amount.available', 'Available:')}{' '}
                <AmountFormatter amount={balance} smallTicker baseUnit={balanceInBaseUnit} />
              </Text>
            </Box>
          </Box>

          <ParaTimeFormFooter
            disabled={disabled}
            secondaryAction={navigateToRecipient}
            submitButton
            withNotice
          />
        </Form>
      </Box>
    </ParaTimeContent>
  )
}
