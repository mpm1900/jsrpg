import React from 'react'
import { ProcessedPartyT } from '../../types/Party'
import {
  CharacterContext,
  CharacterContextProvider,
} from '../../contexts/CharacterContext'
import { usePartyContext } from '../../contexts/PartyContext'
import { CharacterDetails } from '../CharacterDetails'

export interface CombatPartyPropsT {
  party: ProcessedPartyT
}
export const CombatParty = (props: CombatPartyPropsT) => {
  const { party } = props
  const { updateCharacter } = usePartyContext()
  if (!party) return <div>Loading...</div>
  return (
    <div>
      {party.characters.map((character) => (
        <CharacterContextProvider
          key={character.id}
          character={character}
          onChange={(c) => updateCharacter(c, party.id)}
        >
          <CharacterDetails />
        </CharacterContextProvider>
      ))}
    </div>
  )
}
