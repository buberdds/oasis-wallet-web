import { PayloadAction } from '@reduxjs/toolkit'
import { Transaction } from 'app/state/transaction/types'
import { createSlice } from 'utils/@reduxjs/toolkit'
import { AccountState, Account } from './types'

export const initialState: AccountState = {
  address: '',
  liquid_balance: 0,

  accountError: null,
  transactions: [],
  transactionsError: null,
  loading: true,
}

const slice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    clearAccount(state, action: PayloadAction<void>) {
      Object.assign(state, initialState)
    },
    fetchAccount(state, action: PayloadAction<string>) {},
    accountLoaded(state, action: PayloadAction<Account>) {
      state.accountError = null
      Object.assign(state, action.payload)
    },
    accountError(state, action: PayloadAction<string>) {
      state.accountError = action.payload
    },
    transactionsLoaded(state, action: PayloadAction<Transaction[]>) {
      state.transactionsError = null
      state.transactions = action.payload
    },
    transactionsError(state, action: PayloadAction<string>) {
      state.transactionsError = action.payload
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
  },
})

export const { actions: accountActions } = slice

export default slice.reducer
