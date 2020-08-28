import React from 'react'
import { PartyT } from '../../types/Party'
import { CharacterContextProvider } from '../../contexts/CharacterContext'
import { usePartyContext } from '../../contexts/PartyContext'
import { CharacterDetails } from '../CharacterDetails'
import { CombatCharacterSkills } from '../CombatCharacterSkills'
import { useCombatContext } from '../../contexts/CombatContext'
import { PC_PARTY_ID } from '../../state/parties'
import { CombatCharacterTargets } from '../CombatCharacterTargets'
import { processCharacter } from '../../types/Character'

export interface CombatPartyPropsT {
  party: PartyT
}
export const CombatParty = (props: CombatPartyPropsT) => {
  const { party } = props
  const { upsertCharacter } = usePartyContext()
  const {
    characterSkills,
    setCharacterSkill,
    characterTargets,
    setCharacterTarget,
  } = useCombatContext()
  if (!party) return <div>Loading...</div>
  return (
    <div>
      {party.characters.map((character) => (
        <CharacterContextProvider
          key={character.id}
          character={character}
          onChange={(c) => upsertCharacter(c, party.id)}
        >
          <CharacterDetails
            showInspect={
              character.inspected ||
              character.partyId === PC_PARTY_ID ||
              processCharacter(character).dead
            }
            showWeaponInspect={
              character.inspected ||
              character.partyId === PC_PARTY_ID ||
              processCharacter(character).dead
            }
          />
          {party.id === PC_PARTY_ID && (
            <>
              <CombatCharacterSkills
                activeSkillId={characterSkills[character.id]}
                skills={character.skills}
                onClick={(skillId) => setCharacterSkill(character.id, skillId)}
              />
              <CombatCharacterTargets
                activeTargetId={characterTargets[character.id]}
                onClick={(targetId) =>
                  setCharacterTarget(character.id, targetId)
                }
              />
              <div style={{ height: 10 }} />
            </>
          )}
        </CharacterContextProvider>
      ))}
    </div>
  )
}
