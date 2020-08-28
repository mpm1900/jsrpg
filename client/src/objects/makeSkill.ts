import { SkillT } from '../types/Skill'
import { v4 } from 'uuid'
import { makeCharacterCheck } from '../types/Roll2'
import { makeRequirementCheck } from './util'

export const makeSkill = (name: string = 'Weapon Attack'): SkillT => {
  return {
    id: v4(),
    name,
    requirementCheck: makeRequirementCheck(['intelligence'], 1),
    damageRolls: {},
    traits: [],
    events: {},
    combineWeaponDamage: true,
    checkDodgeForTraits: true,
    focusCost: 0,
  }
}

export const BASIC_ATTACK: SkillT = {
  ...makeSkill(),
  id: 'weapon-attack',
}
export const INSPECT: SkillT = {
  ...makeSkill('Inspect'),
  combineWeaponDamage: false,
  damageRolls: {},
  inspected: true,
}
