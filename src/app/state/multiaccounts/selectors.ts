import { createSelector } from '@reduxjs/toolkit'

import { RootState } from 'types'
import { initialState } from '.'

const selectSlice = (state: RootState) => state.multiAccounts || initialState

export const selectError = createSelector([selectSlice], state => state.error)
export const selectMultiAccounts = createSelector([selectSlice], state => state)
export const selectMultiAccountsList = createSelector([selectSlice], state => state.accounts)
export const selectMnemonic = createSelector([selectSlice], state => state.mnemonic)
export const selectSelectedAccounts = createSelector([selectMultiAccountsList], state =>
  state.filter(a => a.selected),
)
