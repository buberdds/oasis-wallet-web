import React, { useContext } from 'react'
import { Box, Form, FormField, ResponsiveContext, TextInput } from 'grommet'
import { Trans, useTranslation } from 'react-i18next'
import { isValidAddress } from 'app/lib/helpers'
import { isValidEthAddress, isValidEthPrivateKey, isValidEthPrivateKeyLength } from 'app/lib/eth-helpers'
import { ParaTimeContent } from '../ParaTimeContent'
import { ParaTimeFormFooter } from '../ParaTimeFormFooter'
import { useParaTimes } from '../useParaTimes'
import { useParaTimesNavigation } from '../useParaTimesNavigation'

export const TransactionRecipient = () => {
  const { t } = useTranslation()
  const isMobile = useContext(ResponsiveContext) === 'small'
  const {
    accountAddress,
    isDepositing,
    isEvmcParaTime,
    paraTimeName,
    setTransactionForm,
    transactionForm,
    usesOasisAddress,
  } = useParaTimes()
  const { navigateToAmount, navigateToDeposit } = useParaTimesNavigation()
  const addressValidator = usesOasisAddress ? isValidAddress : isValidEthAddress

  return (
    <ParaTimeContent
      description={
        <Trans
          i18nKey="paraTimes.recipient.description"
          t={t}
          values={{
            actionType: isDepositing
              ? t('paraTimes.recipient.receiving', 'receiving')
              : t('paraTimes.recipient.withdrawing', 'withdrawing'),
            isEvmc: isEvmcParaTime ? t('paraTimes.common.evmc', '(EVMc)') : '',
            paraTime: paraTimeName,
          }}
          defaults='Please enter the address of the {{actionType}} wallet on the <strong>{{paraTime}}</strong> {{isEvmc}} ParaTime and then click "Next"'
        />
      }
    >
      <Form
        messages={{ required: t('paraTimes.validation.required') }}
        onChange={nextValue => setTransactionForm(nextValue)}
        onSubmit={navigateToAmount}
        value={transactionForm}
        style={{ width: isMobile ? '100%' : '465px' }}
      >
        <Box margin={{ bottom: 'medium' }}>
          {isEvmcParaTime && !isDepositing ? (
            <FormField
              name="privateKey"
              required
              validate={(privateKey: string) => {
                console.log('isValidEthPrivateKeyLength', isValidEthPrivateKeyLength(privateKey))
                if (!isValidEthPrivateKeyLength(privateKey)) {
                  return {
                    message: t(
                      'paraTimes.validation.invalidEthPrivateKeyLength',
                      'Private key length should be 64 characters long',
                    ),
                    status: 'error',
                  }
                } else if (!isValidEthPrivateKey(privateKey)) {
                  return {
                    message: t('paraTimes.validation.invalidEthPrivateKey', 'Private key is invalid'),
                    status: 'error',
                  }
                } else {
                  return undefined
                }
              }}
            >
              <TextInput
                name="privateKey"
                type="password"
                placeholder={t(
                  'paraTimes.recipient.privateKeyPlaceholder',
                  'Enter Ethereum-compatible private key',
                )}
                value={transactionForm.privateKey}
              />
            </FormField>
          ) : (
            <FormField
              name="recipient"
              required
              validate={(recipient: string) =>
                addressValidator(recipient)
                  ? undefined
                  : { message: t('paraTimes.validation.invalidAddress', 'Invalid address'), status: 'error' }
              }
            >
              <TextInput
                name="recipient"
                placeholder={
                  usesOasisAddress ? accountAddress : t('paraTimes.recipient.placeholder', '0x...')
                }
                value={transactionForm.recipient}
              />
            </FormField>
          )}
        </Box>
        <ParaTimeFormFooter secondaryAction={navigateToDeposit} submitButton withNotice />
      </Form>
    </ParaTimeContent>
  )
}
