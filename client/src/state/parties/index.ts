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
import {
  SWORD_OF_BLOOD_AND_FIRE,
  SWORD_OF_THE_INFINITE,
} from '../../objects/builders/weapons/mythics'
import { makeSkill } from '../../objects/makeSkill'
import { makeCharacterRoll, makeCharacterCheck } from '../../types/Roll2'
import { makeTrait, makeRequirementCheck } from '../../objects/util'

export const UPSERT_PARTY = '@actions/parties/upsert-party'
export const UPSERT_CHARACTER = '@actions/parties/upsert-character'
export const DELETE_CHARACTER = '@actions/parties/delete-character'
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
  deleteCharacter: (partyId: string, characterId: string) => {
    return {
      type: DELETE_CHARACTER,
      payload: {
        partyId,
        characterId,
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
  deleteCharacter: (partyId: string, characterId: string) => (
    dispatch: Dispatch,
  ) => {
    dispatch(actionCreators.deleteCharacter(partyId, characterId))
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
  [DELETE_CHARACTER]: (state, action) => {
    return updateIn(state, action.payload.partyId, (party) => ({
      ...party,
      characters: party.characters.filter(
        (c) => c.id !== action.payload.characterId,
      ),
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

const max = makeCharacter('Max M')
const katie = makeCharacter('Katie C')
export const PC_PARTY_ID = v4()
export const INITIAL_STATE: PartyT[] = [
  {
    id: PC_PARTY_ID,
    items: [
      BASIC_SHIELD,
      BASIC_TOME,
      ...Array(198)
        .fill(null)
        .map(() => makeItem()),
    ],
    characters: [
      {
        ...max,
        weapon: SWORD_OF_BLOOD_AND_FIRE,
        skills: [
          ...max.skills,
          {
            ...makeSkill('Fireball'),
            check: makeCharacterCheck(['intelligence']),
            combineWeaponDamage: false,
            damageRolls: {
              fire: makeCharacterRoll([], '4d10'),
            },
            focusCost: 10,
          },
          {
            ...makeSkill('Crippling Blow'),
            requirementCheck: makeRequirementCheck(['strength'], 10),
            combineWeaponDamage: true,
            damageRolls: {},
            traits: [
              {
                ...makeTrait(),
                duration: 2,
                abilitiesModifiers: {
                  strength: 0,
                  dexterity: 0,
                  intelligence: 0,
                  vigor: -5,
                },
              },
            ],
            focusCost: 10,
          },
        ],
      },
      {
        ...katie,
        skills: [
          ...katie.skills,
          {
            ...makeSkill('Thunderbolt'),
            check: makeCharacterCheck(['intelligence']),
            combineWeaponDamage: false,
            damageRolls: {
              light: makeCharacterRoll(['intelligence']),
            },
            focusCost: 3,
          },
        ],
        weapon: SWORD_OF_THE_INFINITE,
      },
    ],
  },
]
export default makeReducer(core, INITIAL_STATE)
export const useParties = () => useSelector((state: StateT) => state.parties)
export const usePartiesActions = () =>
  useActions(actions) as {
    upsertParty: (party: PartyT) => void
    upsertCharacter: (partyId: string, character: CharacterT) => void
    deleteCharacter: (partyId: string, characterId: string) => void
    upsertItem: (partyId: string, item: ItemT) => void
    removeItem: (partyId: string, itemId: string) => void
    equipItem: (partyId: string, characterId: string, itemId: string) => void
    unequipItem: (partyId: string, characterId: string, itemId: string) => void
  }
