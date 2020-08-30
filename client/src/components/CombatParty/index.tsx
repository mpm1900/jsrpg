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
import {
  ZERO_CHECK,
  reduceCharacterCheck,
  getCheckProbability,
  makeCharacterCheck,
} from '../../types/Roll2'

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
          <FlexContainer
            style={{
              position: 'relative',
              opacity: processCharacter(character).dead ? 0.5 : 1,
            }}
          >
            <FlexContainer
              $direction='column'
              $full
              style={{
                marginBottom: 10,
              }}
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
                showSkills={party.id === PC_PARTY_ID}
              />
            </FlexContainer>
            {character.partyId === PC_PARTY_ID && (
              <FlexContainer
                $direction='column'
                style={{
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
            )}
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
  if (!target && skill.target) return null
  const range = getSkillRange(skill, character, target)
  const prob = getCheckProbability(
    reduceCharacterCheck(
      skill.combineWeaponDamage
        ? character.weapon.accuracyCheck
        : skill.check || { ...ZERO_CHECK, keys: [] },
      character,
    ),
  )
  const dodgeProb =
    skill.target && target
      ? getCheckProbability(
          reduceCharacterCheck(makeCharacterCheck(['evade']), target),
        )
      : 0
  return (
    <BoxContainer
      style={{ textAlign: 'center', fontWeight: 'bold', borderLeft: 'none' }}
      substyle={{ borderLeft: 'none', background: '#111' }}
    >
      {range && range !== '0' && (
        <div style={{ marginBottom: 5 }}>({range})</div>
      )}
      <div style={{ fontSize: 20 }}>{Math.floor(prob - dodgeProb)}%</div>
    </BoxContainer>
  )
}
