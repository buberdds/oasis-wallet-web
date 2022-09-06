import { ErrorPayload } from 'types/errors'
import { WalletBalance } from '../wallet/types'

/* --- STATE --- */
export interface MultiAccountsListAccount {
  publicKey: string
  address: string
  path: number[]
  balance: WalletBalance
  selected: boolean
}

export enum MultiAccountsStep {
  OpeningUSB = 'opening_usb',
  LoadingAccounts = 'loading_accounts',
  LoadingBalances = 'loading_balances',
  Done = 'done',
}

export interface MultiAccountsState {
  accounts: MultiAccountsListAccount[]
  error?: ErrorPayload
  mnemonic?: string
  step?: MultiAccountsStep
}
