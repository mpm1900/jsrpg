import React from 'react'
import { ProcessedPartyT, PartyT, processParty } from '../../types/Party'
import { getRandom } from '../../util/getRandom'
import {
  ProcessedCharacterT,
  CharacterT,
  processCharacter,
  combineTraits,
  commitTrait,
  CharacterSkillT,
  CharacterTraitT,
} from '../../types/Character'
import { RollCheckerT } from '../RollContext'
import {
  RollCheckT,
  RollResultT,
  considateStaticRolls,
  makeStaticRoll,
} from '../../types/Roll'
import {
  rollDamage,
  getDamageTypeKeys,
  DamageTypeRollsT,
} from '../../types/Damage'
import { noneg } from '../../util/noneg'
import { v4 } from 'uuid'
import { PC_PARTY_ID } from '../../state/parties'
import { checkEvent, WeaponT, WeaponEventTypeT } from '../../types/Weapon'
import { getKeys } from '../../util/getKeys'
import { BASIC_ATTACK } from '../../objects/makeSkill'
import { NameSpan, logResult } from './log'

export interface AttackResultT {
  id: string
  sourceId: string
  targetId: string
  skillId: string
  skillName: string
  index: number
  hitSuccess: boolean
  criticalSuccess: boolean
  dodgeSuccess: boolean
  rawDamage: number
  blockedDamage: number
  totalDamage: number
  traits: CharacterTraitT[]
}
export const ZERO_RESULT: AttackResultT = {
  id: 'zero',
  sourceId: '',
  targetId: '',
  skillId: BASIC_ATTACK.id,
  skillName: '',
  index: 0,
  hitSuccess: false,
  criticalSuccess: false,
  dodgeSuccess: false,
  rawDamage: 0,
  blockedDamage: 0,
  totalDamage: 0,
  traits: [],
}

export type CombatRoundT = Record<string, AttackResultT>

export const getCombatRecordBuilder = (
  characterSkills: { [characterId: string]: string | undefined },
  characterTargets: { [characterId: string]: string | undefined },
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
    .forEach((source, index) => {
      const partyA = rawParties.find((p) => p.id === source.partyId)
      // this line is volitile
      const partyB = rawParties.find((p) => p.id !== source.partyId)
      if (!partyA || !partyB) return
      const bCharacters = processParty(partyB).characters.filter((c) => !c.dead)
      const target =
        bCharacters.find((c) => c.id === characterTargets[source.id]) ||
        getRandom(bCharacters)
      if (target) {
        result = {
          ...result,
          [source.name]: {
            ...execSkill(
              characterSkills,
              checkCharacter,
              basicRollCharacter,
            )(target, source),
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
const defaultDamageRoll = makeStaticRoll(0)
const cr = (roll?: RollCheckT) => roll || defaultDamageRoll
export const getSkillDamageRolls = (
  skill: CharacterSkillT,
  weapon: WeaponT,
): DamageTypeRollsT => {
  if (skill.combineWeaponDamage) {
    return {
      slashing: formatRoll(
        considateStaticRolls([
          cr(skill.damageRolls.slashing),
          cr(weapon.damageRolls.slashing),
        ]),
      ),
      piercing: formatRoll(
        considateStaticRolls([
          cr(skill.damageRolls.piercing),
          cr(weapon.damageRolls.piercing),
        ]),
      ),
      fire: formatRoll(
        considateStaticRolls([
          cr(skill.damageRolls.fire),
          cr(weapon.damageRolls.fire),
        ]),
      ),
      blood: formatRoll(
        considateStaticRolls([
          cr(skill.damageRolls.blood),
          cr(weapon.damageRolls.blood),
        ]),
      ),
      light: formatRoll(
        considateStaticRolls([
          cr(skill.damageRolls.light),
          cr(weapon.damageRolls.light),
        ]),
      ),
      dark: formatRoll(
        considateStaticRolls([
          cr(skill.damageRolls.dark),
          cr(weapon.damageRolls.dark),
        ]),
      ),
    }
  } else {
    return skill.damageRolls
  }
}

export const getSkillCheck = (
  skill: CharacterSkillT,
  weapon: WeaponT,
): RollCheckT => {
  if (skill.combineWeaponDamage) {
    return weapon.accuracyCheck
  } else {
    return skill.check || { keys: [], value: 18 }
  }
}

export const execSkill = (
  characterSkills: { [characterId: string]: string | undefined },
  checkCharacter: (c: ProcessedCharacterT) => RollCheckerT,
  basicRollCharacter: (c: ProcessedCharacterT) => RollCheckerT,
) => (
  target: ProcessedCharacterT,
  source: ProcessedCharacterT,
): AttackResultT => {
  let attackResult = {
    ...ZERO_RESULT,
    id: v4(),
    targetId: target.id,
    sourceId: source.id,
  }
  const skill =
    source.skills.find((skill) => skill.id === characterSkills[source.id]) ||
    BASIC_ATTACK

  attackResult.skillId = skill.id
  attackResult.skillName = skill.name
  const { weapon } = source
  const damageRolls = getSkillDamageRolls(skill, weapon)
  const skillCheck = getSkillCheck(skill, weapon)
  const skillCheckResult = checkCharacter(source)(skillCheck)
  if (skillCheckResult.result) {
    const criticalSuccess = skillCheckResult.criticalSuccess
    attackResult.hitSuccess = true
    attackResult.criticalSuccess = criticalSuccess
    const damageRollsResult = rollDamage(basicRollCharacter(source))(
      damageRolls,
      criticalSuccess,
    )
    attackResult.rawDamage = damageRollsResult.total
    const dodgeRoll = checkCharacter(target)(DODGE_CHECK)
    attackResult.dodgeSuccess = dodgeRoll.result || false
    if (!dodgeRoll.result) {
      const { damageResistances } = target
      const damageKeys = getDamageTypeKeys(
        damageRollsResult.rollResults,
      ).filter((k) => damageRollsResult.rollResults[k])
      damageKeys.forEach((key) => {
        const damageResult = damageRollsResult.rollResults[key] as RollResultT
        const resistanceCheck = damageResistances[key] as RollCheckT
        const resistanceRoll = basicRollCharacter(source)(
          formatRoll(resistanceCheck),
          true,
        )
        const blockedDamage = criticalSuccess ? 0 : resistanceRoll.total
        const damageTotal = damageResult.total - blockedDamage
        attackResult.blockedDamage += damageResult.total > 0 ? blockedDamage : 0
        attackResult.totalDamage += noneg(damageTotal)
      })
    }
    if (skill.checkDodgeForTraits) {
      if (!dodgeRoll.result) {
        attackResult.traits = skill.traits
      }
    } else {
      attackResult.traits = skill.traits
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
): ProcessedCharacterT[] => {
  if (rounds.length === 0) return []
  if (!rawUserParty || !rawEnemyParty) return []
  let rawCharacters = [...rawUserParty.characters, ...rawEnemyParty.characters]
  const getCharacters = () => rawCharacters.map((c) => processCharacter(c))
  const localUpdate = (
    id: string,
    updater: (character: CharacterT) => CharacterT,
  ) => {
    rawCharacters = rawCharacters.map((c) => (c.id === id ? updater(c) : c))
  }
  const round = rounds[rounds.length - 1]
  addLine(
    <strong style={{ color: 'lightblue' }}>{`ROUND ${rounds.length}`}</strong>,
  )
  Object.values(round)
    .sort((a, b) => a.index - b.index)
    .forEach((attackResult) => {
      const characters = getCharacters()
      const source = characters.find((c) => c.id === attackResult.sourceId)
      const target = characters.find((c) => c.id === attackResult.targetId)
      const rawSource = rawCharacters.find(
        (c) => c.id === attackResult.sourceId,
      )
      const rawTarget = rawCharacters.find(
        (c) => c.id === attackResult.targetId,
      )
      if (!rawSource || !source || !rawTarget || !target) return
      if (!source.dead && !target.dead) {
        logResult(attackResult, source, target, addLine)
        const skill =
          source.skills.find((s) => s.id === attackResult.skillId) ||
          BASIC_ATTACK
        console.log(source.name, skill.name, skill.focusCost)
        const healthOffset = rawTarget.healthOffset + attackResult.totalDamage
        const focusOffset = rawSource.focusOffset + skill.focusCost
        localUpdate(target.id, (c) => ({
          ...c,
          healthOffset,
          inspected: skill.inspected || c.inspected,
        }))
        localUpdate(source.id, (c) => ({
          ...rawSource,
          focusOffset,
        }))

        if (skill.combineWeaponDamage && attackResult.hitSuccess) {
          processEvent('onHit', source, rawSource, addLine, localUpdate)
        }
        if (skill.combineWeaponDamage && attackResult.criticalSuccess) {
          processEvent('onCrit', source, rawSource, addLine, localUpdate)
        }
      }
    })
  rawCharacters.forEach((c) =>
    updateCharacter(
      {
        ...c,
        traits: c.traits
          .map((t) => ({ ...t, duration: t.duration - 1 }))
          .filter((t) => t.duration !== 0),
      },
      c.partyId,
    ),
  )
  return rawCharacters.map((c) => processCharacter(c))
}

export const processEvent = (
  event: WeaponEventTypeT,
  source: ProcessedCharacterT,
  rawSource: CharacterT,
  addLine: (line: React.ReactNode) => void,
  localUpdate: (
    id: string,
    updater: (character: CharacterT) => CharacterT,
  ) => void,
) => {
  const addedTraits = checkEvent(rawSource)(event)
  if (addedTraits) {
    const combinedTrait = combineTraits(addedTraits)
    if (combinedTrait.healthOffset > 0) {
      addLine(
        <span>
          {NameSpan(source)} gained {combinedTrait.healthOffset} HP from{' '}
          {(source.weapon as WeaponT).name}.
        </span>,
      )
    }
    if (combinedTrait.focusOffset > 0) {
      addLine(
        <span>
          {NameSpan(source)} gained {combinedTrait.focusOffset} FP from{' '}
          {(source.weapon as WeaponT).name}.
        </span>,
      )
    }
    getKeys(combinedTrait.abilitiesModifiers).forEach((key) => {
      const value = combinedTrait.abilitiesModifiers[key]
      if (value !== 0) {
        addLine(
          <span>
            {NameSpan(source)} gained {value} {key} from{' '}
            {(source.weapon as WeaponT).name}.
          </span>,
        )
      }
    })
    localUpdate(rawSource.id, (c) => ({
      ...commitTrait(c)(combinedTrait),
      traits: [
        ...c.traits,
        ...addedTraits.map((t) => ({ ...t, healthOffset: 0 })),
      ],
    }))
  }
}

export const checkParty = (party: ProcessedPartyT) => {
  return (
    party &&
    party.characters.filter((c) => c.healthOffset < c.stats.health).length === 0
  )
}

export const checkCharacterActiveSkills = (
  characters: ProcessedCharacterT[],
  characterSkills: { [characterId: string]: string | undefined },
  setCharacterSkill: (characterId: string, skillId?: string) => void,
) => {
  characters.forEach((character) => {
    const activeSkill =
      character.skills.find((s) => s.id === characterSkills[character.id]) ||
      BASIC_ATTACK
    const focus =
      character.stats.focus - character.focusOffset - activeSkill.focusCost
    if (activeSkill.focusCost > focus) {
      setCharacterSkill(character.id, BASIC_ATTACK.id)
    }
  })
}

export const checkCharacterActiveTargets = (
  characters: ProcessedCharacterT[],
  characterTargets: { [characterId: string]: string | undefined },
  setCharacterTarget: (characterId: string, targetId?: string) => void,
) => {
  characters.forEach((character) => {
    const activeTarget = characters.find(
      (c) => c.id === characterTargets[character.id],
    )
    if (activeTarget) {
      if (activeTarget.dead) {
        setCharacterTarget(character.id, undefined)
      }
    }
  })
}

export const ENEMY_PARTY_ID = v4()
export const isUser = (character: CharacterT) =>
  character.partyId === PC_PARTY_ID
export const isEnemy = (character: CharacterT) =>
  character.partyId === ENEMY_PARTY_ID
