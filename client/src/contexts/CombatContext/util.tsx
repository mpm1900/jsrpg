import React from 'react'
import { ProcessedPartyT, PartyT, processParty } from '../../types/Party'
import { getRandom } from '../../util/getRandom'
import {
  ProcessedCharacterT,
  CharacterT,
  processCharacter,
} from '../../types/Character'
import { RollCheckerT } from '../RollContext'
import { RollCheckT, RollResultT } from '../../types/Roll'
import { rollDamage, getDamageTypeKeys } from '../../types/Damage'
import { noneg } from '../../util/noneg'
import { v4 } from 'uuid'
import { PC_PARTY_ID } from '../../state/parties'

export interface AttackResultT {
  label?: string
  id: string
  sourceId: string
  targetId: string
  index: number
  hitSuccess: boolean
  criticalSuccess: boolean
  dodgeSuccess: boolean
  rawDamage: number
  blockedDamage: number
  totalDamage: number
}
export const ZERO_RESULT: AttackResultT = {
  id: 'zero',
  sourceId: '',
  targetId: '',
  index: 0,
  hitSuccess: false,
  criticalSuccess: false,
  dodgeSuccess: false,
  rawDamage: 0,
  blockedDamage: 0,
  totalDamage: 0,
}

export type CombatRoundT = Record<string, AttackResultT>

export const getCombatRecordBuilder = (
  checkCharacter: (c: ProcessedCharacterT) => RollCheckerT,
  basicRollCharacter: (c: ProcessedCharacterT) => RollCheckerT,
) => (
  userParty: ProcessedPartyT,
  enemyParty: ProcessedPartyT,
  rawParties: PartyT[],
): CombatRoundT => {
  const characters = [...userParty.characters, ...enemyParty.characters]
  let result: CombatRoundT = {}
  characters
    .filter((c) => !c.dead)
    .sort((a, b) => b.stats.agility - a.stats.agility)
    .forEach((character, index) => {
      const partyA = rawParties.find((p) => p.id === character.partyId)
      const partyB = rawParties.find((p) => p.id !== character.partyId)
      if (!partyA || !partyB) return
      const bCharacters = processParty(partyB).characters.filter((c) => !c.dead)
      const target = getRandom(bCharacters)
      if (target) {
        result = {
          ...result,
          [character.name]: {
            ...execAttack(
              characters,
              checkCharacter,
              basicRollCharacter,
            )(target.id, character.id),
            index,
          },
        }
      }
    })
  return result
}

export const DODGE_CHECK: RollCheckT = {
  keys: ['dexterity'],
  value: -8,
}

const formatRoll = (roll: RollCheckT): RollCheckT => ({
  ...roll,
  roll: roll.roll || '1d1-1',
})

export const execAttack = (
  characters: ProcessedCharacterT[],
  checkCharacter: (c: ProcessedCharacterT) => RollCheckerT,
  basicRollCharacter: (c: ProcessedCharacterT) => RollCheckerT,
) => (targetId: string, sourceId: string): AttackResultT => {
  const target = characters.find((c) => c.id === targetId)
  const source = characters.find((c) => c.id === sourceId)
  let attackResult = { ...ZERO_RESULT, id: v4(), targetId, sourceId }
  if (target && source) {
    attackResult.label = `${source.name} attacks ${target.name}`
    const { weapon } = source
    const hitRoll = checkCharacter(source)(weapon?.accuracyCheck)
    if (hitRoll.result) {
      const criticalSuccess = hitRoll.criticalSuccess
      attackResult.hitSuccess = true
      attackResult.criticalSuccess = criticalSuccess
      const damageRoll = rollDamage(basicRollCharacter(source))(
        weapon.damageRolls,
        criticalSuccess,
      )
      attackResult.rawDamage = damageRoll.total
      const dodgeRoll = checkCharacter(target)(DODGE_CHECK)
      if (dodgeRoll.result) {
        attackResult.dodgeSuccess = true
      } else {
        const damageResistances = target.damageResistances
        const damageKeys = getDamageTypeKeys(damageRoll.rollResults).filter(
          (k) => damageRoll.rollResults[k],
        )
        damageKeys.forEach((key) => {
          const damageResult = damageRoll.rollResults[key] as RollResultT
          const resistanceCheck = damageResistances[key] as RollCheckT
          const resistanceRoll = basicRollCharacter(source)(
            formatRoll(resistanceCheck),
            true,
          )
          const blockedDamage = criticalSuccess ? 0 : resistanceRoll.total
          const damageTotal = damageResult.total - blockedDamage
          attackResult.blockedDamage +=
            damageResult.total > 0 ? blockedDamage : 0
          attackResult.totalDamage += noneg(damageTotal)
        })
      }
    }
  }
  return attackResult
}

export const resolveRound = (
  rounds: CombatRoundT[],
  rawUserParty: PartyT,
  rawEnemyParty: PartyT,
  addLine: (line: React.ReactNode) => void,
  updateCharacter: (character: CharacterT, partyId?: string) => void,
) => {
  if (rounds.length === 0) return
  if (!rawUserParty || !rawEnemyParty) return
  let rawCharacters = [...rawUserParty.characters, ...rawEnemyParty.characters]
  const getCharacters = () => rawCharacters.map((c) => processCharacter(c))
  const localUpdate = (character: CharacterT) => {
    rawCharacters = rawCharacters.map((c) =>
      c.id === character.id ? character : c,
    )
  }
  const round = rounds[rounds.length - 1]
  addLine(
    <span style={{ color: 'lightblue' }}>{`ROUND ${rounds.length}`}</span>,
  )
  Object.values(round)
    .sort((a, b) => a.index - b.index)
    .forEach((attackResult) => {
      const characters = getCharacters()
      const source = characters.find((c) => c.id === attackResult.sourceId)
      const target = characters.find((c) => c.id === attackResult.targetId)
      const rawTarget = rawCharacters.find(
        (c) => c.id === attackResult.targetId,
      )
      if (!source || !rawTarget || !target) return
      if (!source.dead && !target.dead) {
        logResult(attackResult, source, target, addLine)
        const healthOffset = rawTarget.healthOffset + attackResult.totalDamage
        localUpdate({
          ...rawTarget,
          dead: healthOffset >= target.stats.health,
          healthOffset,
        })
      }
    })
  rawCharacters.forEach((c) => updateCharacter(c, c.partyId))
}

export const logResult = (
  attackResult: AttackResultT,
  source: ProcessedCharacterT,
  target: ProcessedCharacterT,
  addLine: (line: React.ReactNode) => void,
) => {
  if (attackResult.hitSuccess) {
    addLine(
      <span>
        {getNameSpan(source)} attacks {getNameSpan(target)} for{' '}
        {attackResult.totalDamage} damage.
      </span>,
    )
    if (attackResult.criticalSuccess) {
      addLine(<span style={{ color: 'khaki' }}>Critical hit!</span>)
    }
  } else {
    addLine(<span>{getNameSpan(source)}'s attack missed.</span>)
    if (attackResult.dodgeSuccess) {
      addLine(
        <span>
          {getNameSpan(target)} dodged {getNameSpan(source)}'s attack
        </span>,
      )
    }
  }
  if (target.stats.health <= target.healthOffset + attackResult.totalDamage) {
    addLine(<span style={{ color: 'lightcoral' }}>{target.name} died.</span>)
  }
}

export const checkParty = (party: ProcessedPartyT) => {
  return (
    party &&
    party.characters.filter((c) => c.healthOffset < c.stats.health).length === 0
  )
}

export const ENEMY_PARTY_ID = v4()
export const isUser = (character: CharacterT) =>
  character.partyId === PC_PARTY_ID
export const isEnemy = (character: CharacterT) =>
  character.partyId === ENEMY_PARTY_ID
export const getNameSpan = (character: CharacterT) => (
  <span
    style={{
      color: isUser(character)
        ? 'lightgreen'
        : isEnemy(character)
        ? 'lightsalmon'
        : 'white',
      fontWeight: 'bold',
    }}
  >
    {character.name}
  </span>
)
