import React from 'react'
import { CreateWalletPage } from 'app/pages/CreateWalletPage'
import { HomePage } from 'app/pages/HomePage'
import { FromLedger } from 'app/pages/OpenWalletPage/Features/FromLedger'
import { FromMnemonic } from 'app/pages/OpenWalletPage/Features/FromMnemonic'
import { FromPrivateKey } from 'app/pages/OpenWalletPage/Features/FromPrivateKey'
import { AccountPage } from 'app/pages/AccountPage'
import { AccountDetails } from 'app/pages/AccountPage/Features/AccountDetails'
import { ValidatorList } from 'app/pages/StakingPage/Features/ValidatorList'
import { ActiveDelegationList } from 'app/pages/StakingPage/Features/DelegationList/ActiveDelegationList'
import { DebondingDelegationList } from 'app/pages/StakingPage/Features/DelegationList/DebondingDelegationList'

export const commonRoutes = [
  {
    path: '',
    element: <HomePage />,
  },
  {
    path: 'create-wallet',
    element: <CreateWalletPage />,
  },
  {
    path: 'account/:address/*',
    element: <AccountPage />,
    children: [
      {
        path: '',
        element: <AccountDetails />,
      },
      {
        path: 'stake',
        element: <ValidatorList />,
      },
      {
        path: 'active-delegations',
        element: <ActiveDelegationList />,
      },
      {
        path: 'debonding-delegations',
        element: <DebondingDelegationList />,
      },
    ],
  },
  {
    path: 'open-wallet/mnemonic',
    element: <FromMnemonic />,
  },
  {
    path: 'open-wallet/private-key',
    element: <FromPrivateKey />,
  },
  {
    path: 'open-wallet/ledger',
    element: <FromLedger />,
  },
]
