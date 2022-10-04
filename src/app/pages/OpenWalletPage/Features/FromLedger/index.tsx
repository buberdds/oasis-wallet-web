import { importAccountsActions } from 'app/state/importaccounts'
import { Box, Button, Heading } from 'grommet'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { ImportAccountsSelectionModal } from 'app/pages/OpenWalletPage/Features/ImportAccountsSelectionModal'
import { selectShowAccountsSelectionModal, selectDeviceRequested } from 'app/state/importaccounts/selectors'
import { Header } from 'app/components/Header'
import TransportWebUSB from '@ledgerhq/hw-transport-webusb'
import {
  Ledger,
  ledgerTransport,
  getLedgerTransport,
  createLedgerTransport,
  closeLedgerTransport,
  requestDevice,
  isWebUSBSupported,
} from 'app/lib/ledger'
import browser from 'webextension-polyfill'
import { ImportAccountsListAccount, ImportAccountsStep } from 'app/state/importaccounts/types'

browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(sender.tab ? 'from a content script:' + sender.tab.url : 'from the extension')

  closeLedgerTransport()

  if (request.greeting == 'hello') sendResponse({ farewell: 'goodbye' })
})

export function FromLedger() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const showAccountsSelectionModal = useSelector(selectShowAccountsSelectionModal)
  const deviceRequested = useSelector(selectDeviceRequested)

  const meep = async () => {
    const device = await requestDevice()
    if (device) {
      dispatch(importAccountsActions.deviceRequested())
    }
  }

  return (
    <Box
      background="background-front"
      margin="small"
      pad="medium"
      round="5px"
      border={{ color: 'background-front-border', size: '1px' }}
    >
      <Header>{t('openWallet.ledger.header', 'Open from Ledger device')}</Header>

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
          label={t('openWallet.importAccounts.selectWallets', 'Select accounts to open')}
          // onClick={() => {
          //   dispatch(importAccountsActions.enumerateAccountsFromLedger())
          // }}
          onClick={async () => {
            dispatch(importAccountsActions.setStep(ImportAccountsStep.LoadingAccounts))
            await createLedgerTransport()
            const ledgerTransport = getLedgerTransport()
            console.log('ledgerTransport', ledgerTransport)
            const accounts = await Ledger.enumerateAccounts(ledgerTransport)
            closeLedgerTransport()
            // if (await TransportWebUSB.isSupported()) {
            // TransportWebUSB.create().then(transport => {
            // console.log('foo.close', transport.close)
            dispatch(importAccountsActions.enumerateAccountsFromLedger(accounts))
          }}
          primary
        />
      </Box>
      {showAccountsSelectionModal && (
        <ImportAccountsSelectionModal
          abort={() => {
            dispatch(importAccountsActions.clear())
          }}
          type="ledger"
        />
      )}
    </Box>
  )
}
