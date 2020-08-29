import { SkillT } from '../types/Skill'
import { v4 } from 'uuid'
import { makeCharacterCheck, makeCharacterRoll } from '../types/Roll2'
import { makeRequirementCheck, makeTrait } from './util'
import Fireball from '../assets/img/fireball.png'
import Thunderbolt from '../assets/img/thunderbolt.png'
import DarkBlast from '../assets/img/dark-blast.png'
import CripplingBlow from '../assets/img/crippling-blow.png'
import Inspect from '../assets/img/inspect.png'
import WeaponAttack from '../assets/img/weapon-attack.png'

export const makeSkill = (name: string = 'Weapon Attack'): SkillT => {
  return {
    id: v4(),
    name,
    imgSrc: '',
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
  imgSrc: WeaponAttack,
}
export const INSPECT: SkillT = {
  ...makeSkill('Inspect'),
  imgSrc: Inspect,
  combineWeaponDamage: false,
  damageRolls: {},
  inspected: true,
}

export const FIREBALL: SkillT = {
  ...makeSkill('Fireball'),
  imgSrc: Fireball,
  check: makeCharacterCheck(['intelligence']),
  combineWeaponDamage: false,
  damageRolls: {
    fire: makeCharacterRoll([], '4d10', -7),
  },
  focusCost: 10,
}
export const CRIPPLING_BLOW: SkillT = {
  ...makeSkill('Crippling Blow'),
  imgSrc: CripplingBlow,
  requirementCheck: makeRequirementCheck(['strength'], 10),
  combineWeaponDamage: true,
  checkDodgeForTraits: true,
  damageRolls: {},
  traits: [
    {
      ...makeTrait(),
      duration: 2,
      abilitiesModifiers: {
        strength: 0,
        dexterity: 0,
        intelligence: 0,
        vigor: -5,
      },
    },
  ],
  focusCost: 1,
}
export const THUNDERBOLT: SkillT = {
  ...makeSkill('Thunderbolt'),
  imgSrc: Thunderbolt,
  check: makeCharacterCheck(['intelligence']),
  combineWeaponDamage: false,
  damageRolls: {
    light: makeCharacterRoll(['intelligence']),
  },
  focusCost: 3,
}
export const DARK_BLAST: SkillT = {
  ...makeSkill('Dark Blast'),
  imgSrc: DarkBlast,
  check: makeCharacterCheck(['intelligence']),
  combineWeaponDamage: false,
  damageRolls: {
    dark: makeCharacterRoll(['intelligence'], '2d6', -8),
  },
  focusCost: 5,
}
