import { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from 'utils/@reduxjs/toolkit'
import { useInjectReducer } from 'utils/redux-injectors'

import { getThemeFromStorage, saveTheme } from '../utils'
import { ThemeState } from './types'

export const initialState: ThemeState = {
  selected: getThemeFromStorage() || 'system',
}

const slice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    changeTheme(state, action: PayloadAction<'dark' | 'light'>) {
      saveTheme(action.payload)
      state.selected = action.payload
    },
  },
})

// export const { actions: themeActions, reducer } = slice

// export const useThemeSlice = () => {
//   useInjectReducer({ key: slice.name, reducer: slice.reducer })
//   return { actions: slice.actions }
// }
console.log(slice)
export const actions = slice.actions
export default slice.reducer
