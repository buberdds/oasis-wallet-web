/**
 *
 * OpenWalletPage
 *
 */
import { Anchor, Box, Button } from 'grommet'
import * as React from 'react'
import { useSelector } from 'react-redux'
import { Trans, useTranslation } from 'react-i18next'
import { NavLink, Route, Routes } from 'react-router-dom'
import { Header } from 'app/components/Header'
import { FromLedger } from './Features/FromLedger'
import { FromMnemonic } from './Features/FromMnemonic'
import { FromPrivateKey } from './Features/FromPrivateKey'
import { selectDeviceRequested } from 'app/state/importaccounts/selectors'

type SelectOpenMethodProps = {
  openFromLedger?: () => void
}

export function SelectOpenMethod({ openFromLedger }: SelectOpenMethodProps) {
  const { t } = useTranslation()
  const deviceRequested = useSelector(selectDeviceRequested)

  return (
    <Box
      round="5px"
      border={{ color: 'background-front-border', size: '1px' }}
      background="background-front"
      margin="small"
      pad="medium"
    >
      <Header>{t('openWallet.header', 'How do you want to open your wallet?')}</Header>

      <Box direction="row-responsive" justify="start" margin={{ top: 'medium' }} gap="medium">
        <NavLink to="mnemonic">
          <Button type="submit" label={t('openWallet.method.mnemonic', 'Mnemonic')} primary />
        </NavLink>
        <NavLink to="private-key">
          <Button type="submit" label={t('openWallet.method.privateKey', 'Private key')} primary />
        </NavLink>

        {openFromLedger && !deviceRequested ? (
          <Button onClick={openFromLedger} label="Connect Ledger device" primary />
        ) : (
          <NavLink to="ledger">
            <Button type="submit" label={t('openWallet.method.ledger', 'Ledger')} primary />
          </NavLink>
        )}
      </Box>

      <Box
        direction="row-responsive"
        justify="start"
        margin={{ top: 'medium' }}
        gap="medium"
        style={{ whiteSpace: 'pre-wrap', display: 'inline' }}
      >
        <Trans
          i18nKey="openWallet.bitpie.warning"
          t={t}
          defaults="❗ BitPie wallet users: You cannot import the mnemonic phrase directly from your BitPie wallet. <DocsLink>Check documentation for details.</DocsLink>"
          components={{
            DocsLink: <Anchor href="https://docs.oasis.io/general/manage-tokens/faq" />,
          }}
        />
      </Box>
    </Box>
  )
}

interface Props {}
export function OpenWalletPage(props: Props) {
  return (
    <Routes>
      <Route path="/" element={<SelectOpenMethod />} />
      <Route path="/mnemonic" element={<FromMnemonic />} />
      <Route path="/private-key" element={<FromPrivateKey />} />
      <Route path="/ledger" element={<FromLedger />} />
    </Routes>
  )
}
