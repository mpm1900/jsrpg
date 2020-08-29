import React from 'react'
import { PartyT } from '../../types/Party'
import {
  CharacterContextProvider,
  useCharacterContext,
} from '../../contexts/CharacterContext'
import { usePartyContext } from '../../contexts/PartyContext'
import { CharacterDetails } from '../CharacterDetails'
import { CombatCharacterSkills } from '../CombatCharacterSkills'
import { useCombatContext } from '../../contexts/CombatContext'
import { PC_PARTY_ID } from '../../state/parties'
import { CombatCharacterTargets } from '../CombatCharacterTargets'
import { processCharacter, ProcessedCharacterT } from '../../types/Character'
import { FlexContainer, FullContainer } from '../../elements/flex'
import { BoxContainer } from '../../elements/box'
import { getSkillRange } from '../../types/Skill'
import { useRollContext } from '../../contexts/RollContext'
import { BASIC_ATTACK } from '../../objects/makeSkill'

export interface CombatPartyPropsT {
  party: PartyT
}
export const CombatParty = (props: CombatPartyPropsT) => {
  const { party } = props
  const { upsertCharacter } = usePartyContext()
  const {
    userParty,
    enemyParty,
    characterSkills,
    setCharacterSkill,
    characterTargets,
    setCharacterTarget,
  } = useCombatContext()
  if (!party || !userParty || !enemyParty) return <div>Loading...</div>

  const characters = [...userParty.characters, ...enemyParty.characters]
  return (
    <div>
      {party.characters.map((character) => (
        <CharacterContextProvider
          key={character.id}
          character={character}
          onChange={(c) => upsertCharacter(c, party.id)}
        >
          <FlexContainer style={{ position: 'relative' }}>
            <FlexContainer $direction='column' $full>
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
                    onClick={(skillId) =>
                      setCharacterSkill(character.id, skillId)
                    }
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
            </FlexContainer>
            <FlexContainer
              $direction='column'
              style={{
                position: 'absolute',
                right: -80,
                top: 'calc(50% - 27px)',
                fontFamily: 'monospace',
                width: 80,
              }}
            >
              <FullContainer />
              <SelectedDamageRange
                skillId={characterSkills[character.id]}
                targetId={characterTargets[character.id]}
                characters={characters}
              />
              <FullContainer />
            </FlexContainer>
          </FlexContainer>
        </CharacterContextProvider>
      ))}
    </div>
  )
}

interface SelectedDamageRangePropsT {
  skillId?: string
  targetId?: string
  characters: ProcessedCharacterT[]
}
const SelectedDamageRange = (props: SelectedDamageRangePropsT) => {
  const { skillId, targetId, characters } = props
  const { character } = useCharacterContext()
  const skill = character.skills.find((s) => s.id === skillId) || BASIC_ATTACK
  const target = characters.find((c) => c.id === targetId)
  console.log(targetId)
  console.log(character, target)
  if (!target) return null
  const range = getSkillRange(skill, character, target)
  return range !== '0' ? (
    <BoxContainer style={{ textAlign: 'center', fontWeight: 'bold' }}>
      ({range})
    </BoxContainer>
  ) : null
}
