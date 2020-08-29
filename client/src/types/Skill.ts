import {
  CharacterCheckT,
  CharacterRollT,
  Roll2ResultT,
  resolveCharacterRoll,
} from './Roll2'
import { DamageTypeRollsT, rollDamage, getDamageTypeKeys } from './Damage'
import { CharacterTraitT, ProcessedCharacterT } from './Character'
import { EventsT } from './Events'
import { getSkillDamageRolls } from '../contexts/CombatContext/util'
import { RollCheckerT } from '../contexts/RollContext'
import { noneg } from '../util/noneg'

export interface SkillT {
  id: string
  name: string
  imgSrc: string
  check?: CharacterCheckT
  requirementCheck: CharacterCheckT
  damageRolls: DamageTypeRollsT
  traits: CharacterTraitT[]
  events: EventsT
  combineWeaponDamage: boolean
  checkDodgeForTraits: boolean
  focusCost: number
  inspected?: true
}

export const getSkillRange = (
  skill: SkillT,
  source: ProcessedCharacterT,
  target?: ProcessedCharacterT,
): string | undefined => {
  if (!target) return undefined
  let min = 0
  let max = 0
  const damageRolls = getSkillDamageRolls(skill, source.weapon)
  const rr = (r: CharacterRollT) => resolveCharacterRoll(r, source)
  const damageRollsResult = rollDamage(rr)(damageRolls, false)
  const damageResults = damageRollsResult.rollResults
  const { damageResistances } = target
  const damageKeys = getDamageTypeKeys(damageResults).filter(
    (k) => damageResults[k],
  )
  damageKeys.forEach((key) => {
    const damageResult = damageResults[key] as Roll2ResultT
    const resistanceCheck = damageResistances[key] as CharacterRollT
    const resistanceResult = resolveCharacterRoll(resistanceCheck, source, true)
    min += noneg(damageResult.minTotal - resistanceResult.maxTotal)
    max += noneg(damageResult.maxTotal - resistanceResult.minTotal)
  })
  if (min === max) return `${max}`
  return `${min}-${max}`
}
