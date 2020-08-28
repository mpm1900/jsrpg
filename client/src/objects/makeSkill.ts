import { CharacterSkillT } from '../types/Character'
import { v4 } from 'uuid'

export const makeSkill = (name: string = 'Weapon Attack'): CharacterSkillT => {
  return {
    id: v4(),
    name,
    damageRolls: {},
    traits: [],
    events: {},
    combineWeaponDamage: true,
    checkDodgeForTraits: true,
    focusCost: 0,
  }
}

export const BASIC_ATTACK: CharacterSkillT = {
  ...makeSkill(),
  id: 'weapon-attack',
}
export const INSPECT: CharacterSkillT = {
  ...makeSkill('Inspect'),
  combineWeaponDamage: false,
  damageRolls: {},
  inspected: true,
}
