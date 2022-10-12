/**
 *
 * OpenWalletPage
 *
 */
import { Anchor, Box, Button } from 'grommet'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { Header } from 'app/components/Header'
import { selectShowAccountsSelectionModal } from 'app/state/importaccounts/selectors'

export type SelectOpenMethodProps = {
  webExtensionLedgerAccess?: () => void
}

export function SelectOpenMethod({ webExtensionLedgerAccess }: SelectOpenMethodProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const showAccountsSelectionModal = useSelector(selectShowAccountsSelectionModal)

  useEffect(() => {
    if (showAccountsSelectionModal) {
      navigate('/open-wallet/ledger')
    }
  }, [navigate, showAccountsSelectionModal])

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

        {webExtensionLedgerAccess ? (
          <Button
            style={{ width: 'fit-content' }}
            onClick={webExtensionLedgerAccess}
            label={t('ledger.extension.grantAccess', 'Grant access to your Ledger')}
            primary
          />
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

export function OpenWalletPage() {
  return <SelectOpenMethod />
}
