import { createSelector } from '@reduxjs/toolkit'

import { RootState } from 'types'
import { initialState } from '.'

const selectSlice = (state: RootState) => state.wallet || initialState
export const selectActiveWalletId = createSelector([selectSlice], state => state.selectedWallet)
export const selectActiveWallet = createSelector([selectSlice, selectActiveWalletId], (state, activeId) => {
  if (activeId === undefined || activeId === null) {
    return undefined
  } else {
    return state.wallets[activeId!]
  }
})

export const selectWallets = createSelector([selectSlice], state => state.wallets ?? {})
export const selectWalletsPublicKeys = createSelector([selectWallets], wallets =>
  Object.values(wallets).map(w => w.publicKey),
)
export const selectWalletsAddresses = createSelector([selectWallets], wallets =>
  Object.values(wallets).map(w => w.address),
)
export const selectAddress = createSelector([selectActiveWallet], wallet => wallet?.address ?? '')
export const selectPublicKey = createSelector([selectActiveWallet], wallet => wallet?.publicKey ?? '')
export const selectBalance = createSelector([selectActiveWallet], wallet => wallet?.balance)
export const selectType = createSelector([selectActiveWallet], wallet => wallet?.type)
export const selectIsOpen = createSelector([selectSlice], wallet => wallet.isOpen)
