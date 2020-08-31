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
import makeItem from '../../objects/builders/makeItem'
import { makeCharacter } from '../../objects/makeCharacter'
import {
  SWORD_OF_BLOOD_AND_FIRE,
  SWORD_OF_THE_INFINITE,
} from '../../objects/builders/weapons/mythics'
import {
  FIREBALL,
  CRIPPLING_BLOW,
  THUNDERBOLT,
  DARK_BLAST,
  HEALING,
  WRATH,
  CHARGE,
  SKILL_SHOT,
  VANISH,
  SHADOW_STRIKE,
} from '../../objects/makeSkill'
import { buildWeapon } from '../../objects/builders/weapons/createWeapon'
import { SLASHING_MOD } from '../../objects/builders/mods'
import { WeaponModT } from '../../types/Weapon'

export const UPSERT_PARTY = '@actions/parties/upsert-party'
export const UPSERT_CHARACTER = '@actions/parties/upsert-character'
export const DELETE_CHARACTER = '@actions/parties/delete-character'
export const UPSERT_ITEM = '@actions/parties/upsert-item'
export const DELETE_ITEM = '@actions/parties/delete-item'
export const UPSERT_MOD = '@actions/parties/upsert-mod'
export const DELETE_MOD = '@actions/parties/delete-mod'

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
  upsertMod: (partyId: string, mod: WeaponModT) => {
    return {
      type: UPSERT_MOD,
      payload: {
        partyId,
        mod,
      },
    }
  },
  deleteMod: (partyId: string, modId: string) => {
    return {
      type: DELETE_MOD,
      payload: {
        partyId,
        modId,
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
  upsertMod: (partyId: string, mod: WeaponModT) => (dispatch: Dispatch) => {
    dispatch(actionCreators.upsertMod(partyId, mod))
  },
  deleteMod: (partyId: string, modId: string) => (dispatch: Dispatch) => {
    dispatch(actionCreators.deleteMod(partyId, modId))
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
    const [items, character] = unequipItem(_character)(itemId)
    dispatch(actionCreators.upsertCharacter(partyId, character))
    items.forEach((item) => {
      dispatch(actionCreators.upsertItem(partyId, item))
    })
  },
  equipMod: (partyId: string, characterId: string, modId: string) => (
    dispatch: Dispatch,
    getState: () => StateT,
  ) => {
    const party = getState().parties.find((p) => p.id === partyId)
    if (!party) return
    const character = party.characters.find((c) => c.id === characterId)
    const mod = party.mods.find((m) => m.id === modId)
    if (!character || !mod) return
    const { weapon } = character
    if (!weapon) return
    if (weapon.slotCount > weapon.slots.length) {
      dispatch(
        actionCreators.upsertCharacter(partyId, {
          ...character,
          weapon: { ...weapon, slots: [...weapon.slots, mod] },
        }),
      )
      dispatch(actionCreators.deleteMod(partyId, modId))
    }
  },
  unequipMod: (partyId: string, characterId: string, modId: string) => (
    dispatch: Dispatch,
    getState: () => StateT,
  ) => {
    console.log('unequip mod')
    const party = getState().parties.find((p) => p.id === partyId)
    if (!party) return
    const character = party.characters.find((c) => c.id === characterId)
    if (!character) return
    const { weapon } = character
    if (!weapon) return
    const mod = weapon.slots.find((m) => m.id === modId)
    if (!mod) return
    dispatch(
      actionCreators.upsertCharacter(partyId, {
        ...character,
        weapon: {
          ...weapon,
          slots: weapon.slots.filter((m) => m.id !== modId),
        },
      }),
    )
    dispatch(actionCreators.upsertMod(partyId, mod))
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
  [UPSERT_MOD]: (state, action) => {
    return updateIn(state, action.payload.partyId, (party) => ({
      ...party,
      mods: upsertIn(party.mods, action.payload.mod),
    }))
  },
  [DELETE_MOD]: (state, action) => {
    return updateIn(state, action.payload.partyId, (party) => ({
      ...party,
      mods: party.mods.filter((i) => i.id !== action.payload.modId),
    }))
  },
}

const max = makeCharacter('Character One')
const katie = makeCharacter('Character Two')
const milo = makeCharacter('Character Three')
export const PC_PARTY_ID = v4()
export const INITIAL_STATE: PartyT[] = [
  {
    id: PC_PARTY_ID,
    items: [],
    skills: [
      WRATH,
      CHARGE,
      CRIPPLING_BLOW,
      VANISH,
      SHADOW_STRIKE,
      SKILL_SHOT,
      THUNDERBOLT,
      FIREBALL,
      DARK_BLAST,
      HEALING,
    ],
    mods: [SLASHING_MOD],
    characters: [
      {
        ...max,
        weapon: SWORD_OF_THE_INFINITE,
        skills: [
          ...max.skills,
          WRATH,
          CHARGE,
          CRIPPLING_BLOW,
          VANISH,
          SHADOW_STRIKE,
          SKILL_SHOT,
          THUNDERBOLT,
          FIREBALL,
          DARK_BLAST,
          HEALING,
        ],
      },
      {
        ...katie,
        skills: [
          ...katie.skills,
          WRATH,
          CHARGE,
          CRIPPLING_BLOW,
          VANISH,
          SHADOW_STRIKE,
          SKILL_SHOT,
          THUNDERBOLT,
          FIREBALL,
          DARK_BLAST,
          HEALING,
        ],
        weapon: SWORD_OF_BLOOD_AND_FIRE,
      },
      {
        ...milo,
        skills: [
          ...milo.skills,
          WRATH,
          CHARGE,
          CRIPPLING_BLOW,
          VANISH,
          SHADOW_STRIKE,
          SKILL_SHOT,
          THUNDERBOLT,
          FIREBALL,
          DARK_BLAST,
          HEALING,
        ],
        weapon: buildWeapon('greataxe', 'mythic'),
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
    upsertMod: (partyId: string, mod: WeaponModT) => void
    deleteMod: (partyId: string, modId: string) => void
    equipItem: (partyId: string, characterId: string, itemId: string) => void
    unequipItem: (partyId: string, characterId: string, itemId: string) => void
    equipMod: (partyId: string, characterId: string, modId: string) => void
    unequipMod: (partyId: string, characterId: string, modId: string) => void
  }
