import React from 'react'
import { openTab } from 'utils/webextension'
import { SelectOpenMethod } from './'

export function OpenWalletPageWebExtension() {
  return (
    <SelectOpenMethod webExtensionLedgerAccess={() => openTab(`${window.location.href}/connect-device`)} />
  )
}
