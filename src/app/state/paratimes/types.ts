import { StringifiedBigInt } from 'types/StringifiedBigInt'
import { ErrorPayload } from 'types/errors'
import { ParaTime } from '../../../config'

export enum TransactionFormSteps {
  TransferType,
  ParaTimeSelection,
  TransactionRecipient,
  TransactionAmount,
  TransactionConfirmation,
  TransactionSummary,
  TransactionError,
}

export enum TransactionTypes {
  Deposit = 'deposit',
  Withdraw = 'withdraw',
}

export interface TransactionForm {
  amount: string
  confirmTransfer: boolean
  confirmTransferToValidator: boolean
  confirmTransferToForeignAccount: boolean
  feeAmount: string
  feeGas: string
  paraTime?: ParaTime
  privateKey: string
  recipient: string
  type: TransactionTypes | undefined
}

export interface ParaTimesState {
  balance: StringifiedBigInt
  isLoading: boolean
  transactionError?: ErrorPayload
  transactionForm: TransactionForm
  transactionFormStep: TransactionFormSteps
}

export type OasisAddressBalancePayload = {
  paraTime: ParaTime
}

export type EvmcBalancePayload = {
  privateKey: string
  paraTime: ParaTime
}

export type Runtime = {
  address: string
  id: string
  decimals: number
}

export type ParaTimeTransaction = Pick<
  TransactionForm,
  'amount' | 'feeAmount' | 'feeGas' | 'recipient' | 'type'
>
