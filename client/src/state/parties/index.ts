import { PartyT } from '../../types/Party'
import { StateActionT, StateT, StateCoreT } from '../types'
import {
  CharacterT,
  canEquip,
  equipItem,
  unequipItem,
} from '../../types/Character'
import { Dispatch } from 'redux'
import { v4 } from 'uuid'
import { makeReducer } from '../util'
import { useSelector } from 'react-redux'
import { useActions } from '../../hooks/useActions'
import { ItemT, EquippableT } from '../../types/Item'
import { upsertIn, updateIn } from '../../util/updateIn'
import { BASIC_SHIELD } from '../../objects/basicShield'
import { BASIC_TOME } from '../../objects/basicTome'
import makeItem from '../../objects/builders/makeItem'
import { makeCharacter } from '../../objects/makeCharacter'

export const UPSERT_PARTY = '@actions/parties/upsert-party'
export const UPSERT_CHARACTER = '@actions/parties/upsert-character'
export const UPSERT_ITEM = '@actions/parties/upsert-item'
export const DELETE_ITEM = '@actions/parties/delete-item'

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
  deleteItem: (partyId: string, itemId: string) => {
    return {
      type: DELETE_ITEM,
      payload: {
        partyId,
        itemId,
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
  removeItem: (partyId: string, itemId: string) => (dispatch: Dispatch) => {
    dispatch(actionCreators.deleteItem(partyId, itemId))
  },
  equipItem: (partyId: string, characterId: string, itemId: string) => (
    dispatch: Dispatch,
    getState: () => StateT,
  ) => {
    const party = getState().parties.find((p) => p.id === partyId)
    if (!party) return
    const character = party.characters.find((c) => c.id === characterId)
    const item = party.items.find((i) => i.id === itemId) as EquippableT
    if (!character || !item) return
    if (!canEquip(character)(item)) return
    dispatch(
      actionCreators.upsertCharacter(partyId, equipItem(character)(item)),
    )
    dispatch(actionCreators.deleteItem(partyId, item.id))
  },
  unequipItem: (partyId: string, characterId: string, itemId: string) => (
    dispatch: Dispatch,
    getState: () => StateT,
  ) => {
    const party = getState().parties.find((p) => p.id === partyId)
    if (!party) return
    const _character = party.characters.find((c) => c.id === characterId)
    if (!_character) return
    const [item, character] = unequipItem(_character)(itemId)
    dispatch(actionCreators.upsertCharacter(partyId, character))
    if (!item) return
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
  [DELETE_ITEM]: (state, action) => {
    return updateIn(state, action.payload.partyId, (party) => ({
      ...party,
      items: party.items.filter((i) => i.id !== action.payload.itemId),
    }))
  },
}

export const PC_PARTY_ID = v4()
export const INITIAL_STATE: PartyT[] = [
  {
    id: PC_PARTY_ID,
    items: [
      BASIC_SHIELD,
      BASIC_TOME,
      ...Array(204)
        .fill(null)
        .map(() => makeItem()),
    ],
    characters: [makeCharacter('Max M'), makeCharacter('Katie C')],
  },
]
export default makeReducer(core, INITIAL_STATE)
export const useParties = () => useSelector((state: StateT) => state.parties)
export const usePartiesActions = () =>
  useActions(actions) as {
    upsertParty: (party: PartyT) => void
    upsertCharacter: (partyId: string, character: CharacterT) => void
    upsertItem: (partyId: string, item: ItemT) => void
    removeItem: (partyId: string, itemId: string) => void
    equipItem: (partyId: string, characterId: string, itemId: string) => void
    unequipItem: (partyId: string, characterId: string, itemId: string) => void
  }
