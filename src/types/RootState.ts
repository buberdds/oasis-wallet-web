// import { GithubRepoFormState } from 'app/pages/HomePage/Features/GithubRepoForm/slice/types';
import { ThemeState } from 'styles/theme/slice/types'
import { WalletState } from 'app/state/wallet/types'
import { CreateWalletState } from 'app/pages/CreateWalletPage/slice/types'
import { OpenWalletState } from 'app/pages/OpenWalletPage/slice/types'
import { AccountState } from 'app/state/account/types'
import { NetworkState } from 'app/state/network/types'
import { TransactionState } from 'app/state/transaction/types'
import { LedgerState } from 'app/state/ledger/types'
import { StakingState } from 'app/state/staking/types'
import { FatalErrorState } from 'app/state/fatalerror/types'
// [IMPORT NEW CONTAINERSTATE ABOVE] < Needed for generating containers seamlessly

export interface RootState {
  theme: ThemeState
  wallet: WalletState
  createWallet: CreateWalletState
  openWallet: OpenWalletState
  account: AccountState
  network: NetworkState
  transaction: TransactionState
  ledger: LedgerState
  staking: StakingState
  fatalError: FatalErrorState
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
}
