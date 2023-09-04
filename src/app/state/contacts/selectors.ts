import { createSelector } from '@reduxjs/toolkit'

import { RootState } from 'types'
import { initialState } from '.'

const selectSlice = (state: RootState) => state.contacts || initialState

export const selectContactsList = createSelector([selectSlice], contacts =>
  Object.keys(contacts).map(contact => ({
    address: contacts[contact].address,
    name: contacts[contact].name,
  })),
)

export const selectContact = (address: string) => createSelector([selectSlice], contacts => contacts[address])
