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
import { FromLedger } from './Features/FromLedger'
import { FromMnemonic } from './Features/FromMnemonic'
import { FromPrivateKey } from './Features/FromPrivateKey'
import { openTab } from 'utils/webextension'

// export function SelectOpenMethod() {
//   const { t } = useTranslation()
//   const foo = () => {
//     openTab(`${location.href}/ledger`)
//     // onClick={async () => {
//     // await TransportWebUSB.isSupported()
//     // const transport = await TransportWebUSB.create()
//     // dispatch(importAccountsActions.enumerateAccountsFromLedger(transport))
//     //   if (await TransportWebUSB.isSupported()) await TransportWebUSB.create()
//     // dispatch(importAccountsActions.enumerateAccountsFromLedger())
//     // }}
//     // browser.windows.create({
//     //   url: `${location.href}/ledger`,
//     //   // url: '/#/open-wallet',
//     //   type: 'normal',
//     //   // type: 'popup',
//     //   width: 500,
//     //   height: 600,
//     // })
//   }
//   return (
//     <Box
//       round="5px"
//       border={{ color: 'background-front-border', size: '1px' }}
//       background="background-front"
//       margin="small"
//       pad="medium"
//     >
//       <Header>{t('openWallet.header', 'How do you want to open your wallet?')}</Header>

//       <Box direction="row-responsive" justify="start" margin={{ top: 'medium' }} gap="medium">
//         <NavLink to="mnemonic">
//           <Button type="submit" label={t('openWallet.method.mnemonic', 'Mnemonic')} primary />
//         </NavLink>
//         <NavLink to="private-key">
//           <Button type="submit" label={t('openWallet.method.privateKey', 'Private key')} primary />
//         </NavLink>

//         <Button onClick={foo} label="Extension Ledger" primary />

//         {/* <NavLink to="ledger">
//           <Button type="submit" label={t('openWallet.method.ledger', 'Ledger')} primary />
//         </NavLink> */}
//       </Box>

//       <Box
//         direction="row-responsive"
//         justify="start"
//         margin={{ top: 'medium' }}
//         gap="medium"
//         style={{ whiteSpace: 'pre-wrap', display: 'inline' }}
//       >
//         <Trans
//           i18nKey="openWallet.bitpie.warning"
//           t={t}
//           defaults="❗ BitPie wallet users: You cannot import the mnemonic phrase directly from your BitPie wallet. <DocsLink>Check documentation for details.</DocsLink>"
//           components={{
//             DocsLink: <Anchor href="https://docs.oasis.io/general/manage-tokens/faq" />,
//           }}
//         />
//       </Box>
//     </Box>
//   )
// }

interface Props {}
export function OpenWalletPageWebExtension(props: Props) {
  return (
    <Routes>
      <Route
        path="/"
        element={<SelectOpenMethod openFromLedger={() => openTab(`${location.href}/ledger`)} />}
      />
      <Route path="/mnemonic" element={<FromMnemonic />} />
      <Route path="/private-key" element={<FromPrivateKey />} />
      <Route path="/ledger" element={<FromLedger />} />
    </Routes>
  )
}
