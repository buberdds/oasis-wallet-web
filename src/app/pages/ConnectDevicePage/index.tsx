import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Box, Button, Spinner, Text } from 'grommet'
import { StatusCritical, StatusGood } from 'grommet-icons'
import { Header } from 'app/components/Header'
import { importAccountsActions } from 'app/state/importaccounts'
import { requestDevice } from 'app/lib/ledger'
import logotype from '../../../../public/logo192.png'

type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error'
type ConnectionStatusIconPros = {
  success?: boolean
  label: string
}

function ConnectionStatusIcon({ success = true, label }: ConnectionStatusIconPros) {
  return (
    <Box align="center" direction="row" gap="small" justify="center">
      {success ? (
        <StatusGood color="successful-label" size="30px" />
      ) : (
        <StatusCritical color="status-error" size="30px" />
      )}
      <Text weight="bold" size="large" textAlign="center">
        {label}
      </Text>
    </Box>
  )
}

export function ConnectDevicePage() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [connection, setConnection] = useState<ConnectionStatus>('disconnected')
  const handleConnect = async () => {
    setConnection('connecting')
    try {
      const device = await requestDevice()
      if (device) {
        setConnection(device ? 'connected' : 'disconnected')
        dispatch(importAccountsActions.enumerateAccountsFromLedger())
      }
    } catch (error: any) {
      if (error.message.match(/No device selected/)) {
        setConnection('disconnected')
      } else {
        setConnection('error')
      }
    }
  }

  return (
    <Box
      style={{ minHeight: '100vh' }}
      justify="center"
      align="center"
      pad="medium"
      background="background-back"
    >
      <Box
        elevation="small"
        round="5px"
        background="background-front"
        pad="large"
        style={{ position: 'relative' }}
      >
        <Box margin={{ bottom: 'medium' }} align="center">
          <img src={logotype} alt="Oasis" width="75" height="75" />
        </Box>
        <Header textAlign="center">{t('ledger.extension.grantAccess', 'Grant access to your Ledger')}</Header>
        <Box gap="medium">
          <ol>
            <li>
              {t('ledger.instructionSteps.connectLedger', 'Connect your Ledger device to the computer')}
            </li>
            <li>{t('ledger.instructionSteps.closeLedgerLive', 'Close Ledger Live app on the computer')}</li>
            <li>{t('ledger.instructionSteps.openOasisApp', 'Open the Oasis App on your Ledger device')}</li>
            <li>
              {t(
                'ledger.extension.instructionStep',
                'Once device is connected continue the operation in the wallet app',
              )}
            </li>
          </ol>

          {connection === 'connecting' && (
            <Box
              style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
              background={{
                color: 'background-front',
                opacity: 'medium',
              }}
              align="center"
              justify="center"
            >
              <Spinner size="medium" />
            </Box>
          )}
          {connection === 'connected' && (
            <ConnectionStatusIcon label={t('ledger.extension.succeed', 'Device connected')} />
          )}
          {connection === 'error' && (
            <ConnectionStatusIcon success={false} label={t('ledger.extension.failed', 'Connection failed')} />
          )}
          {connection !== 'connected' && (
            <Box justify="center">
              <Button
                onClick={handleConnect}
                label={t('ledger.extension.connect', 'Connect Ledger device')}
                primary
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}
