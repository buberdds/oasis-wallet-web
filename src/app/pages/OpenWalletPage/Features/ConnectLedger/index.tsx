import { importAccountsActions } from 'app/state/importaccounts'
import { Box, Button, Heading } from 'grommet'
import React, { useState } from 'react'
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

export function ConnectLedger() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
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
      <Header>Ledger device</Header>
      <ol>
        <li>{t('ledger.instructionSteps.connectLedger', 'Connect your Ledger device to the computer')}</li>
        <li>{t('ledger.instructionSteps.closeLedgerLive', 'Close Ledger Live app on the computer')}</li>
        <li>{t('ledger.instructionSteps.openOasisApp', 'Open the Oasis App on your Ledger device')}</li>
      </ol>
      <Box align="center" justify="center" direction="row" margin={{ top: 'medium' }}>
        <Button primary onClick={meep}>
          Connect Ledger device
        </Button>
      </Box>
    </Box>
  )
}
