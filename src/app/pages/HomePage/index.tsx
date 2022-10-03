import { Box, Button, Grid, Paragraph, ResponsiveContext } from 'grommet'
import { Add, Unlock } from 'grommet-icons'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { Header } from 'app/components/Header'
import TransportWebUSB from '@ledgerhq/hw-transport-webusb'
import { listen } from '@ledgerhq/logs'
export function HomePage() {
  const size = useContext(ResponsiveContext)
  const { t } = useTranslation()
  return (
    <>
      <Grid gap="small" pad="small" columns={size === 'small' ? ['auto'] : ['2fr', '2fr']}>
        <Box
          round="5px"
          border={{ color: 'background-front-border', size: '1px' }}
          background="background-front"
          pad="large"
        >
          <Header>{t('home.existing.header', 'Access existing wallet')}</Header>

          <button
            onClick={() =>
              chrome.windows.create({
                url: location.href,
                type: 'popup',
                width: 500,
                height: 600,
              })
            }
          >
            popup
          </button>

          <button
            onClick={() =>
              chrome.windows.create({
                url: location.href,
                type: 'normal',
                // width: 500,
                // height: 600,
              })
            }
          >
            normal
          </button>

          <button
            onClick={async () => {
              listen(log => console.log(log))
              if (await TransportWebUSB.isSupported()) await TransportWebUSB.create()
              console.log('added')
            }}
          >
            webusb
          </button>
          <Paragraph>
            {t(
              'home.existing.description',
              'Open your existing wallet stored on Ledger, import a private key or a mnemonic phrase.',
            )}
          </Paragraph>
          <Box direction="row" justify="between" margin={{ top: 'medium' }}>
            <NavLink to="open-wallet">
              <Button
                type="submit"
                label={t('home.existing.button', 'Open wallet')}
                primary
                icon={<Unlock />}
              />
            </NavLink>
          </Box>
        </Box>
        <Box
          round="5px"
          border={{ color: 'background-front-border', size: '1px' }}
          background="background-front"
          pad="large"
        >
          <Header>{t('home.create.header', 'Create new wallet')}</Header>
          <Paragraph>
            {t(
              'home.create.description',
              'Create a brand new wallet to send, receive, stake and swap ROSE tokens.',
            )}
          </Paragraph>
          <Box direction="row" justify="between" margin={{ top: 'medium' }}>
            <NavLink to="create-wallet">
              <Button type="submit" label={t('home.create.button', 'Create wallet')} primary icon={<Add />} />
            </NavLink>
          </Box>
        </Box>
      </Grid>
    </>
  )
}
