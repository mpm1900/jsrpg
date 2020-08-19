import { CharacterT } from '../../types/Character'
import { Dispatch } from 'redux'
import { StateActionT, StateCoreT, StateT } from '../types'
import { BASE_CHARACTER } from '../../objects/baseCharacter'
import { useSelector } from 'react-redux'
import { makeReducer } from '../util'

export const UPDATE_CHARACTER = '@state/characters/UPDATE_CHARACTER'

export const actionCreators = {
  updateCharacter: (character: CharacterT): StateActionT => ({
    type: UPDATE_CHARACTER,
    payload: {
      character,
    },
  }),
}

export const actions = {
  updateCharacter: (dispatch: Dispatch) => (character: CharacterT) => {
    dispatch(actionCreators.updateCharacter(character))
  },
}

export const core: StateCoreT<CharacterT[]> = {
  [UPDATE_CHARACTER]: (state, action) => {
    return state.map((character) =>
      character.id === action.payload.character.id
        ? action.payload.character
        : character,
    )
  },
}

export const INITIAL_STATE = [BASE_CHARACTER]
export default makeReducer(core, INITIAL_STATE)
export const useCharacters = () =>
  useSelector((state: StateT) => state.characters)
