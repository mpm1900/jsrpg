import { PartyT } from '../../types/Party'
import { StateActionT, StateT, StateCoreT } from '../types'
import { CharacterT } from '../../types/Character'
import { Dispatch } from 'redux'
import { v4 } from 'uuid'
import { BASE_CHARACTER } from '../../objects/baseCharacter'
import { makeReducer } from '../util'
import { useSelector } from 'react-redux'
import { useActions } from '../../hooks/useActions'
import { ItemT } from '../../types/Item'
import { upsertIn, updateIn } from '../../util/updateIn'

export const UPSERT_PARTY = '@actions/parties/upsert-party'
export const UPSERT_CHARACTER = '@actions/parties/upsert-character'
export const UPSERT_ITEM = '@actions/parties/upsert-item'

export const actionCreators = {
  upsertParty: (party: PartyT): StateActionT => ({
    type: UPSERT_PARTY,
    payload: {
      party,
    },
  }),
  upsertCharacter: (partyId: string, character: CharacterT) => {
    return {
      type: UPSERT_CHARACTER,
      payload: {
        partyId,
        character,
      },
    }
  },
  upsertItem: (partyId: string, item: ItemT) => {
    return {
      type: UPSERT_ITEM,
      payload: {
        partyId,
        item,
      },
    }
  },
}

export const actions = {
  upsertParty: (party: PartyT) => (dispatch: Dispatch) => {
    dispatch(actionCreators.upsertParty(party))
  },
  upsertCharacter: (partyId: string, character: CharacterT) => (
    dispatch: Dispatch,
  ) => {
    dispatch(actionCreators.upsertCharacter(partyId, character))
  },
  upsertItem: (partyId: string, item: ItemT) => (dispatch: Dispatch) => {
    dispatch(actionCreators.upsertItem(partyId, item))
  },
}

export const core: StateCoreT<PartyT[]> = {
  [UPSERT_PARTY]: (state, action) => {
    return upsertIn(state, action.payload.party)
  },
  [UPSERT_CHARACTER]: (state, action) => {
    return updateIn(state, action.payload.partyId, (party) => ({
      ...party,
      characters: upsertIn(party.characters, action.payload.character),
    }))
  },
  [UPSERT_ITEM]: (state, action) => {
    return updateIn(state, action.payload.partyId, (party) => ({
      ...party,
      items: upsertIn(party.items, action.payload.item),
    }))
  },
}

export const PC_PARTY_ID = v4()
export const INITIAL_STATE: PartyT[] = [
  {
    id: PC_PARTY_ID,
    items: [],
    characters: [
      BASE_CHARACTER,
      { ...BASE_CHARACTER, id: v4(), name: 'Character two' },
    ],
  },
]
export default makeReducer(core, INITIAL_STATE)
export const useParties = () => useSelector((state: StateT) => state.parties)
export const usePartiesActions = () =>
  useActions(actions) as {
    upsertParty: (party: PartyT) => void
    upsertCharacter: (partyId: string, character: CharacterT) => void
  }
