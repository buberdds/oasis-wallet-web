/**
 *
 * OpenWalletPage
 *
 */
import { Anchor, Box, Button } from 'grommet'
import * as React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { NavLink, Route, Routes } from 'react-router-dom'
import { Header } from 'app/components/Header'
import { SelectOpenMethod } from './'
import { ConnectLedger } from './Features/ConnectLedger'
import { FromLedger } from './Features/FromLedger'
import { FromMnemonic } from './Features/FromMnemonic'
import { FromPrivateKey } from './Features/FromPrivateKey'
import { openTab } from 'utils/webextension'

interface Props {}
export function OpenWalletPageWebExtension(props: Props) {
  return (
    <Routes>
      <Route
        path="/"
        element={<SelectOpenMethod openFromLedger={() => openTab(`${location.href}/connect-ledger`)} />}
      />
      <Route path="/mnemonic" element={<FromMnemonic />} />
      <Route path="/private-key" element={<FromPrivateKey />} />
      <Route path="/ledger" element={<FromLedger />} />
      <Route path="/connect-ledger" element={<ConnectLedger />} />
    </Routes>
  )
}
