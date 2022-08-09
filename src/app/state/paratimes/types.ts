import { StringifiedBigInt } from 'types/StringifiedBigInt'
import { ParaTimes } from '../../../config'

export enum TransactionFormSteps {
  TransferType,
  ParaTimeSelection,
  TransactionRecipient,
  TransactionAmount,
  TransactionConfirmation,
  TransactionSummary,
}

export enum TransactionTypes {
  Deposit = 'deposit',
  Withdraw = 'withdraw',
}

export interface TransactionForm {
  amount: StringifiedBigInt
  confirmation: boolean
  paraTime?: ParaTimes
  privateKey: string
  recipient: string
  type?: TransactionTypes
}

export interface ParaTimesState {
  balance: StringifiedBigInt
  isLoading: boolean
  transactionForm: TransactionForm
  transactionFormStep: TransactionFormSteps
}

export type OasisAddressBalancePayload = {
  address: string
  paraTime: ParaTimes
}

export type EvmcBalancePayload = {
  privateKey: string
  paraTime: ParaTimes
}
