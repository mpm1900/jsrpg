import React, { useMemo, useContext, useState } from 'react'
import { PartyT, ProcessedPartyT, processParty } from '../../types/Party'
import { CharacterT, ProcessedCharacterT } from '../../types/Character'
import { v4 } from 'uuid'
import { useParties, PC_PARTY_ID, usePartiesActions } from '../../state/parties'
import { actionCreators } from '../../state/rolls'
import { EquippableT } from '../../types/Item'
import { WeaponModT } from '../../types/Weapon'

export interface PartyContextT {
  parties: ProcessedPartyT[]
  rawParties: PartyT[]
  userParty: ProcessedPartyT
  rawUserParty: PartyT
  activeCharacterId: string | null

  upsertParty: (party: PartyT) => void
  upsertItem: (item: EquippableT) => void
  upsertCharacter: (character: CharacterT, partyId?: string) => void
  deleteCharacter: (characterId: string, partyId?: string) => void
  upsertMod: (mod: WeaponModT, partyId?: string) => void
  deleteMod: (modId: string, partyId?: string) => void
  findCharacter: (
    characterId: string,
    partyId?: string,
  ) => ProcessedCharacterT | undefined
  findRawCharacter: (
    characterId: string,
    partyId?: string,
  ) => CharacterT | undefined
  equipItem: (characterId: string, itemId: string, partyId?: string) => void
  unequipItem: (characterId: string, itemId: string, partyId?: string) => void
  equipMod: (characterId: string, modId: string, partyId?: string) => void
  unequipMod: (characterId: string, modId: string, partyId?: string) => void
  setActiveCharacterId: (id: string | null) => void
}
const defaultContextValue: PartyContextT = {
  parties: [],
  rawParties: [],
  userParty: {
    id: v4(),
    characters: [],
    processed: true,
    items: [],
    skills: [],
    mods: [],
  },
  rawUserParty: { id: v4(), characters: [], items: [], skills: [], mods: [] },
  activeCharacterId: null,
  upsertParty: (party) => {},
  upsertItem: (item) => {},
  upsertCharacter: (character, partyId) => {},
  deleteCharacter: (characterId, partyId) => {},
  upsertMod: (mod, partyId) => {},
  deleteMod: (modId, partyId) => {},
  findCharacter: (characterId, partyId) => undefined,
  findRawCharacter: (characterId, partyId) => undefined,
  equipItem: (characterId, itemId, partyId) => {},
  unequipItem: (characterId, itemId, partyId) => {},
  equipMod: (characterId, modId, partyId) => {},
  unequipMod: (characterId, modId, partyId) => {},
  setActiveCharacterId: (id) => {},
}
export const PartyContext = React.createContext<PartyContextT>(
  defaultContextValue,
)

export interface PartyContextProviderPropsT {
  children: React.ReactNode | React.ReactNode[]
}
export const PartyContextProvider = (props: PartyContextProviderPropsT) => {
  const { children } = props
  const actions = usePartiesActions()
  const rawParties = useParties()
  const parties = useMemo(() => {
    return rawParties.map((p) => processParty(p))
  }, [rawParties])
  const userParty = parties.find((p) => p.id === PC_PARTY_ID) as ProcessedPartyT
  const rawUserParty = rawParties.find((p) => p.id === PC_PARTY_ID) as PartyT
  const [activeCharacterId, setActiveCharacterId] = useState<string | null>(
    null,
  )
  const upsertParty = (party: PartyT) => {
    if (!party) return
    if ((party as ProcessedPartyT).processed) {
      throw new Error('No Processed Parties Allowed')
    }
    actions.upsertParty(party)
  }
  const upsertItem = (item: EquippableT, partyId: string = PC_PARTY_ID) => {
    actions.upsertItem(partyId, item)
  }
  const upsertCharacter = (
    character: CharacterT,
    partyId: string = PC_PARTY_ID,
  ) => {
    if (!character) return
    if ((character as ProcessedCharacterT).processed) {
      throw new Error('No processed Characters Allowed')
    }
    actions.upsertCharacter(partyId, character)
  }
  const deleteCharacter = (
    characterId: string,
    partyId: string = PC_PARTY_ID,
  ) => {
    actions.deleteCharacter(partyId, characterId)
  }
  const upsertMod = (mod: WeaponModT, partyId: string = PC_PARTY_ID) => {
    actions.upsertMod(partyId, mod)
  }
  const deleteMod = (modId: string, partyId: string = PC_PARTY_ID) => {
    actions.deleteMod(partyId, modId)
  }
  const equipItem = (
    characterId: string,
    itemId: string,
    partyId: string = PC_PARTY_ID,
  ) => {
    actions.equipItem(partyId, characterId, itemId)
  }
  const unequipItem = (
    characterId: string,
    itemId: string,
    partyId: string = PC_PARTY_ID,
  ) => {
    actions.unequipItem(partyId, characterId, itemId)
  }
  const equipMod = (
    characterId: string,
    modId: string,
    partyId: string = PC_PARTY_ID,
  ) => {
    actions.equipMod(partyId, characterId, modId)
  }
  const unequipMod = (
    characterId: string,
    modId: string,
    partyId: string = PC_PARTY_ID,
  ) => {
    actions.unequipMod(partyId, characterId, modId)
  }
  const findCharacter = (
    characterId: string,
    partyId: string = PC_PARTY_ID,
  ) => {
    const party = parties.find((p) => p.id === partyId) as ProcessedPartyT
    return party.characters.find((c) => c.id === characterId)
  }
  const findRawCharacter = (
    characterId: string,
    partyId: string = PC_PARTY_ID,
  ) => {
    const party = rawParties.find((p) => p.id === partyId) as PartyT
    return party.characters.find((c) => c.id === characterId)
  }

  return (
    <PartyContext.Provider
      value={{
        parties,
        rawParties,
        userParty,
        rawUserParty,
        activeCharacterId,
        upsertParty,
        upsertItem,
        upsertCharacter,
        deleteCharacter,
        upsertMod,
        deleteMod,
        equipItem,
        unequipItem,
        equipMod,
        unequipMod,
        findCharacter,
        findRawCharacter,
        setActiveCharacterId,
      }}
    >
      {children}
    </PartyContext.Provider>
  )
}

export const usePartyContext = () => useContext(PartyContext)
