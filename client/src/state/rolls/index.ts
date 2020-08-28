import { Dispatch } from 'redux'
import { StateActionT, StateCoreT, StateT } from '../types'
import { useSelector } from 'react-redux'
import { makeReducer } from '../util'
import { Roll2ResultT, Check2ResultT } from '../../types/Roll2'

export const ADD_ROLL = '@state/rolls/ADD_ROLL'

export const actionCreators = {
  addRoll: (rollResult: Roll2ResultT | Check2ResultT): StateActionT => ({
    type: ADD_ROLL,
    payload: {
      rollResult,
    },
  }),
}

export const actions = {
  addRoll: (dispatch: Dispatch) => (
    rollResult: Roll2ResultT | Check2ResultT,
  ) => {
    dispatch(actionCreators.addRoll(rollResult))
  },
}

export const core: StateCoreT<(Roll2ResultT | Check2ResultT)[]> = {
  [ADD_ROLL]: (state, action) => {
    return [...state, action.payload.rollResult]
  },
}

export const INITIAL_STATE = []
export default makeReducer(core, INITIAL_STATE)
export const useRolls = () => useSelector((state: StateT) => state.rolls)
