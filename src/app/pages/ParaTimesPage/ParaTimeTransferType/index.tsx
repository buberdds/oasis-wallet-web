import React from 'react'
import { Box, Button, Text } from 'grommet'
import { useTranslation } from 'react-i18next'
import { ParaTimeContent } from '../ParaTimeContent'
import { useParaTimes } from '../useParaTimes'
import { useParaTimesNavigation } from '../useParaTimesNavigation'

export const ParaTimeTransferType = () => {
  const { t } = useTranslation()
  const { accountIsLoading, isWalletEmpty } = useParaTimes()
  const { navigateToDeposit, navigateToWithdraw } = useParaTimesNavigation()
  const disabled = !accountIsLoading && isWalletEmpty

  return (
    <ParaTimeContent
      header={t('paraTimes.transfers.header', 'ParaTimes Transfers')}
      description={t(
        'paraTimes.transfers.description',
        'Use the "Deposit" option to transfer your ROSE tokens from Consensus to a ParaTime of your choosing or "Withdraw" option to transfer your ROSE tokens from a ParaTime back to Consensus.',
      )}
    >
      <Box gap="medium" responsive={false}>
        <Box>
          <Button
            disabled={disabled}
            fill="horizontal"
            label={t('paraTimes.transfers.deposit', 'Deposit to ParaTime')}
            onClick={navigateToDeposit}
            primary
          />
          {disabled && (
            <Text size="small" margin={{ top: 'xsmall' }}>
              {t('paraTimes.transfers.depositDisabled', "You don't have any ROSE tokens to transfer")}
            </Text>
          )}
        </Box>
        <Button
          fill="horizontal"
          label={t('paraTimes.transfers.withdraw', 'Withdraw from ParaTime')}
          onClick={navigateToWithdraw}
        />
      </Box>
    </ParaTimeContent>
  )
}
