import React, { useMemo, useContext } from 'react'
import { PartyT, ProcessedPartyT, processParty } from '../../types/Party'
import { CharacterT, ProcessedCharacterT } from '../../types/Character'
import { v4 } from 'uuid'
import {
  useParties,
  PC_PARTY_ID,
  actionCreators,
  usePartiesActions,
} from '../../state/parties'
import { useDispatch } from 'react-redux'

export interface PartyContextT {
  parties: ProcessedPartyT[]
  rawParties: PartyT[]
  userParty: ProcessedPartyT
  rawUserParty: PartyT

  upsertParty: (party: PartyT) => void
  updateCharacter: (character: CharacterT, partyId?: string) => void
  findCharacter: (
    characterId: string,
    partyId?: string,
  ) => ProcessedCharacterT | undefined
  findRawCharacter: (
    characterId: string,
    partyId?: string,
  ) => CharacterT | undefined
}
const defaultContextValue: PartyContextT = {
  parties: [],
  rawParties: [],
  userParty: { id: v4(), characters: [], processed: true, items: [] },
  rawUserParty: { id: v4(), characters: [], items: [] },
  upsertParty: (party) => {},
  updateCharacter: (character, partyId) => {},
  findCharacter: (characterId, partyId) => undefined,
  findRawCharacter: (characterId, partyId) => undefined,
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
  const upsertParty = (party: PartyT) => {
    if (!party) return
    if ((party as ProcessedPartyT).processed) {
      throw new Error('No Processed Parties Allowed')
    }
    actions.upsertParty(party)
  }
  const updateCharacter = (
    character: CharacterT,
    partyId: string = PC_PARTY_ID,
  ) => {
    if (!character) return
    if ((character as ProcessedCharacterT).processed) {
      throw new Error('No processed Characters Allowed')
    }
    actions.upsertCharacter(partyId, character)
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
        upsertParty,
        updateCharacter,
        findCharacter,
        findRawCharacter,
      }}
    >
      {children}
    </PartyContext.Provider>
  )
}

export const usePartyContext = () => useContext(PartyContext)
