import React from 'react'
import { ProcessedPartyT, PartyT, processParty } from '../../types/Party'
import { getRandom } from '../../util/getRandom'
import {
  ProcessedCharacterT,
  CharacterT,
  processCharacter,
  combineTraits,
  commitTrait,
  CharacterTraitT,
} from '../../types/Character'
import { RollCheckerT } from '../RollContext'
import {
  rollDamage,
  getDamageTypeKeys,
  DamageTypeRollsT,
} from '../../types/Damage'
import { noneg } from '../../util/noneg'
import { v4 } from 'uuid'
import { PC_PARTY_ID } from '../../state/parties'
import { WeaponT } from '../../types/Weapon'
import { getKeys } from '../../util/getKeys'
import { BASIC_ATTACK } from '../../objects/makeSkill'
import { NameSpan, logResult } from './log'
import {
  combineCharacterRolls,
  ZERO_ROLL,
  CharacterRollT,
  CharacterCheckT,
  makeCharacterCheck,
  Check2ResultT,
  Roll2ResultT,
} from '../../types/Roll2'
import { SkillT } from '../../types/Skill'
import { EventTypeT, checkEvent } from '../../types/Events'

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
  checkCharacter: (
    c: ProcessedCharacterT,
  ) => RollCheckerT<CharacterCheckT, Check2ResultT>,
  rollCharacter: (
    c: ProcessedCharacterT,
  ) => RollCheckerT<CharacterRollT, Roll2ResultT>,
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
              rollCharacter,
            )(target, source),
            index,
          },
        }
      }
    })
  return result
}

export const DODGE_CHECK: CharacterCheckT = makeCharacterCheck(
  ['dexterity'],
  undefined,
  +8,
)

const cr = (roll?: CharacterRollT): CharacterRollT =>
  roll || { ...ZERO_ROLL, keys: [] }
export const getSkillDamageRolls = (
  skill: SkillT,
  weapon: WeaponT,
): DamageTypeRollsT => {
  if (skill.combineWeaponDamage) {
    return {
      slashing: combineCharacterRolls(
        cr(skill.damageRolls.slashing),
        cr(weapon.damageRolls.slashing),
      ),
      piercing: combineCharacterRolls(
        cr(skill.damageRolls.piercing),
        cr(weapon.damageRolls.piercing),
      ),
      fire: combineCharacterRolls(
        cr(skill.damageRolls.fire),
        cr(weapon.damageRolls.fire),
      ),
      blood: combineCharacterRolls(
        cr(skill.damageRolls.blood),
        cr(weapon.damageRolls.blood),
      ),
      light: combineCharacterRolls(
        cr(skill.damageRolls.light),
        cr(weapon.damageRolls.light),
      ),
      dark: combineCharacterRolls(
        cr(skill.damageRolls.dark),
        cr(weapon.damageRolls.dark),
      ),
    }
  } else {
    return skill.damageRolls
  }
}

export const getSkillCheck = (
  skill: SkillT,
  weapon: WeaponT,
): CharacterCheckT => {
  if (skill.combineWeaponDamage) {
    return weapon.accuracyCheck
  } else {
    return skill.check || makeCharacterCheck([], undefined, 0, 18)
  }
}

export const execSkill = (
  characterSkills: { [characterId: string]: string | undefined },
  checkCharacter: (
    c: ProcessedCharacterT,
  ) => RollCheckerT<CharacterCheckT, Check2ResultT>,
  rollCharacter: (
    c: ProcessedCharacterT,
  ) => RollCheckerT<CharacterRollT, Roll2ResultT>,
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
    const rr = rollCharacter(source)
    const damageRollsResult = rollDamage(rr)(
      damageRolls,
      criticalSuccess,
      `${source.name} damage`,
    )
    attackResult.rawDamage = damageRollsResult.total
    const dodgeRoll = checkCharacter(target)(DODGE_CHECK)
    attackResult.dodgeSuccess = dodgeRoll.result || false
    if (!dodgeRoll.result) {
      const { damageResistances } = target
      console.log(damageResistances)
      const damageKeys = getDamageTypeKeys(
        damageRollsResult.rollResults,
      ).filter((k) => damageRollsResult.rollResults[k])
      damageKeys.forEach((key) => {
        const damageResult = damageRollsResult.rollResults[key] as Roll2ResultT
        const resistanceCheck = damageResistances[key] as CharacterRollT
        const resistanceRoll = rollCharacter(source)(resistanceCheck, true)
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
        const healthOffset = rawTarget.healthOffset + attackResult.totalDamage
        const focusOffset = rawSource.focusOffset + skill.focusCost
        const getTraitUpdates = (c: CharacterT): CharacterT => {
          if (attackResult.hitSuccess) {
            return {
              ...commitTrait(c)(combineTraits(skill.traits)),
              inspected: skill.inspected || c.inspected,
              traits: [
                ...c.traits,
                ...skill.traits.map((t) => ({
                  ...t,
                  healthOffset: 0,
                  focusOffset: 0,
                })),
              ],
            }
          }
          return c
        }
        localUpdate(target.id, (c) => ({
          ...c,
          ...getTraitUpdates(c),
          healthOffset,
        }))
        localUpdate(source.id, (c) => ({
          ...rawSource,
          focusOffset,
        }))

        if (skill.combineWeaponDamage && attackResult.hitSuccess) {
          processEvent('onHit', source, rawSource, skill, addLine, localUpdate)
        }
        if (skill.combineWeaponDamage && attackResult.criticalSuccess) {
          processEvent('onCrit', source, rawSource, skill, addLine, localUpdate)
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
  event: EventTypeT,
  source: ProcessedCharacterT,
  rawSource: CharacterT,
  skill: SkillT,
  addLine: (line: React.ReactNode) => void,
  localUpdate: (
    id: string,
    updater: (character: CharacterT) => CharacterT,
  ) => void,
) => {
  const addedTraits = checkEvent(rawSource, skill)(event)
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
