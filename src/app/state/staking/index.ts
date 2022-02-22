import { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from 'utils/@reduxjs/toolkit'
import { useInjectSaga } from 'utils/redux-injectors'

import { stakingSaga } from './saga'
import { DebondingDelegation, Delegation, StakingState, Validator, ValidatorDetails } from './types'

export const initialState: StakingState = {
  debondingDelegations: [],
  delegations: [],
  validators: [],
  updateValidatorsError: null,
  selectedValidatorDetails: null,
  selectedValidator: null,
  loading: false,
}

const slice = createSlice({
  name: 'staking',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
    fetchAccount(state, action: PayloadAction<string>) {},
    updateValidators(state, action: PayloadAction<Validator[]>) {
      state.updateValidatorsError = null
      state.validators = action.payload
    },
    updateValidatorsError(state, action: PayloadAction<string>) {
      state.updateValidatorsError = action.payload
    },
    updateDelegations(state, action: PayloadAction<Delegation[]>) {
      state.delegations = action.payload
    },
    updateDebondingDelegations(state, action: PayloadAction<DebondingDelegation[]>) {
      state.debondingDelegations = action.payload
    },
    validatorSelected(state, action: PayloadAction<string>) {
      state.selectedValidator = action.payload
      state.selectedValidatorDetails = null
    },
    validatorDeselected(state, action: PayloadAction<void>) {
      state.selectedValidator = null
      state.selectedValidatorDetails = null
    },
    updateValidatorDetails(state, action: PayloadAction<ValidatorDetails>) {
      state.selectedValidatorDetails = action.payload
    },
  },
})

export const { actions: stakingActions, reducer: stakingReducer } = slice

export const useStakingSlice = () => {
  useInjectSaga({ key: slice.name, saga: stakingSaga })
  return { actions: slice.actions }
}

export default stakingReducer

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useStakingSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
