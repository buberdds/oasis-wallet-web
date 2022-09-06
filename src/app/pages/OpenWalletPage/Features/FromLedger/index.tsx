import { multiAccountsActions } from 'app/state/multiaccounts'
import { Box, Button, Heading } from 'grommet'
import React from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { MultiAccountsSelectionModal } from 'app/pages/OpenWalletPage/Features/MultiAccountsSelectionModal'

export function FromLedger() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [showMultiAccountsModal, setShowMultiAccountsModal] = useState(false)

  return (
    <Box
      background="background-front"
      margin="small"
      pad="medium"
      round="5px"
      border={{ color: 'background-front-border', size: '1px' }}
    >
      <Heading margin={{ top: '0' }}>{t('openWallet.ledger.header', 'Open from Ledger device')}</Heading>

      <Heading level="3" margin="0">
        {t('ledger.instructionSteps.header', 'Steps:')}
      </Heading>
      <ol>
        <li>{t('ledger.instructionSteps.connectLedger', 'Connect your Ledger device to the computer')}</li>
        <li>{t('ledger.instructionSteps.closeLedgerLive', 'Close Ledger Live app on the computer')}</li>
        <li>{t('ledger.instructionSteps.openOasisApp', 'Open the Oasis App on your Ledger device')}</li>
        <li>
          {t(
            'ledger.instructionSteps.confirmPendingReview',
            'Press both buttons on Ledger device to confirm `Pending Ledger review`',
          )}
        </li>
      </ol>
      <Box direction="row" margin={{ top: 'medium' }}>
        <Button
          type="submit"
          label={t('openWallet.multiaccounts.selectWallets', 'Select accounts to open')}
          onClick={() => {
            dispatch(multiAccountsActions.enumerateAccountsFromLedger())
            setShowMultiAccountsModal(true)
          }}
          primary
        />
      </Box>
      {showMultiAccountsModal && (
        <MultiAccountsSelectionModal
          abort={() => {
            setShowMultiAccountsModal(false)
          }}
          type="ledger"
        />
      )}
    </Box>
  )
}
