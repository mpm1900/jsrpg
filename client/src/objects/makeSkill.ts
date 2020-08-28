import { CharacterSkillT } from '../types/Character'
import { v4 } from 'uuid'
import { makeStaticRoll } from '../types/Roll'

export const makeSkill = (name: string = 'Weapon Attack'): CharacterSkillT => {
  return {
    id: v4(),
    name,
    damageRolls: {
      slashing: makeStaticRoll(0),
      piercing: makeStaticRoll(0),
      fire: makeStaticRoll(0),
      blood: makeStaticRoll(0),
      light: makeStaticRoll(0),
      dark: makeStaticRoll(0),
    },
    traits: [],
    events: {},
    combineWeaponDamage: true,
    checkDodgeForTraits: true,
    focusCost: 0,
  }
}

export const BASIC_ATTACK = { ...makeSkill(), id: 'weapon-attack' }
