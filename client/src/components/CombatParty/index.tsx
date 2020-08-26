import React from 'react'
import { PartyT } from '../../types/Party'
import { CharacterContextProvider } from '../../contexts/CharacterContext'
import { usePartyContext } from '../../contexts/PartyContext'
import { CharacterDetails } from '../CharacterDetails'

export interface CombatPartyPropsT {
  party: PartyT
}
export const CombatParty = (props: CombatPartyPropsT) => {
  const { party } = props
  const { upsertCharacter } = usePartyContext()
  if (!party) return <div>Loading...</div>
  return (
    <div>
      {party.characters.map((character) => (
        <CharacterContextProvider
          key={character.id}
          character={character}
          onChange={(c) => upsertCharacter(c, party.id)}
        >
          <CharacterDetails showInspect={true} showWeaponInspect={true} />
        </CharacterContextProvider>
      ))}
    </div>
  )
}
