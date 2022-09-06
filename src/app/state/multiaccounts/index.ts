import { PayloadAction } from '@reduxjs/toolkit'
import { ErrorPayload } from 'types/errors'
import { createSlice } from 'utils/@reduxjs/toolkit'
import { MultiAccountsListAccount, MultiAccountsState, MultiAccountsStep } from './types'

export const initialState: MultiAccountsState = { accounts: [] }

const slice = createSlice({
  name: 'multiAccounts',
  initialState,
  reducers: {
    clear(state, action: PayloadAction<void>) {
      state.accounts = []
      state.error = undefined
      state.mnemonic = undefined
      state.step = undefined
    },
    enumerateAccountsFromLedger(state, action: PayloadAction<void>) {
      state.step = undefined
      state.accounts = []
    },
    enumerateAccountsFromMnemonic(state, action: PayloadAction<string>) {
      state.step = undefined
      state.accounts = []
    },
    toggleAccount(state, action: PayloadAction<number>) {
      const index = action.payload
      state.accounts[index].selected = !state.accounts[index].selected
    },
    accountsListed(state, action: PayloadAction<MultiAccountsListAccount[]>) {
      state.accounts = action.payload
    },
    setMnemonic(state, action: PayloadAction<string>) {
      state.mnemonic = action.payload
    },
    setStep(state, action: PayloadAction<MultiAccountsStep>) {
      state.step = action.payload
    },
    operationFailed(state, action: PayloadAction<ErrorPayload>) {
      state.error = action.payload
      state.mnemonic = undefined
      state.step = undefined
    },
  },
})

export const { actions: multiAccountsActions } = slice

export default slice.reducer
