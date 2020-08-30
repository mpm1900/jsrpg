import { SkillT } from '../types/Skill'
import { v4 } from 'uuid'
import {
  makeCharacterCheck,
  makeCharacterRoll,
  makeStandardCharacterCheck,
  makeRoll,
} from '../types/Roll2'
import { makeRequirementCheck, makeTrait } from './util'
import Healing from '../assets/img/healing1.png'
import Fireball from '../assets/img/fireball.png'
import Thunderbolt from '../assets/img/thunderbolt.png'
import DarkBlast from '../assets/img/dark-blast.png'
import CripplingBlow from '../assets/img/crippling-blow.png'
import Wrath from '../assets/img/wrath.png'
import Charge from '../assets/img/charge.png'
import SkillShot from '../assets/img/headshot.png'
import ShadowStrike from '../assets/img/shadow-strike.png'
import Vanish from '../assets/img/vanish.png'
import Inspect from '../assets/img/inspect.png'
import WeaponAttack from '../assets/img/weapon-attack.png'

export const makeSkill = (name: string = 'Weapon Attack'): SkillT => {
  return {
    id: v4(),
    name,
    imgSrc: '',
    requirementCheck: makeRequirementCheck(['intelligence'], 1),
    damageRolls: {},
    targetTraits: [],
    sourceTraits: [],
    events: {},
    combineWeaponDamage: true,
    checkDodgeForTraits: true,
    focusCost: 0,
    target: true,
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
  ...makeSkill('Critical Blow'),
  imgSrc: CripplingBlow,
  requirementCheck: makeRequirementCheck(['strength'], 10),
  combineWeaponDamage: true,
  checkDodgeForTraits: true,
  damageRolls: {},
  targetTraits: [
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
    {
      ...makeTrait(),
      duration: -1,
      focusOffset: -3,
      abilitiesModifiers: {
        strength: 0,
        dexterity: 0,
        intelligence: 0,
        vigor: 0,
      },
    },
  ],
  focusCost: 1,
}
export const THUNDERBOLT: SkillT = {
  ...makeSkill('Thunderbolt'),
  imgSrc: Thunderbolt,
  check: makeStandardCharacterCheck(['intelligence'], -3),
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
export const HEALING: SkillT = {
  ...makeSkill('Healing'),
  target: false,
  imgSrc: Healing,
  check: makeCharacterCheck(['intelligence']),
  combineWeaponDamage: false,
  damageRolls: {},
  focusCost: 5,
  sourceTraits: [
    {
      ...makeTrait(),
      healthOffset: 15,
    },
  ],
}
export const WRATH: SkillT = {
  ...makeSkill('Wrath'),
  imgSrc: Wrath,
  check: makeCharacterCheck(['strength']),
  combineWeaponDamage: false,
  damageRolls: { piercing: makeCharacterRoll([], '1d6') },
  focusCost: 5,
  sourceTraits: [
    {
      ...makeTrait(),
      duration: 4,
      abilitiesModifiers: {
        strength: 2,
        dexterity: 0,
        intelligence: 0,
        vigor: 0,
      },
    },
  ],
  targetTraits: [
    {
      ...makeTrait(),
      duration: 4,
      abilitiesModifiers: {
        strength: -2,
        dexterity: 0,
        intelligence: 0,
        vigor: 0,
      },
    },
  ],
}
export const CHARGE: SkillT = {
  ...makeSkill('Charge'),
  imgSrc: Charge,
  focusCost: 5,
  check: makeCharacterCheck(['strength']),
  combineWeaponDamage: false,
  damageRolls: {
    slashing: makeCharacterRoll(['strength'], '3d6', -12),
    piercing: makeCharacterRoll(['strength'], '3d6', -12),
  },
  sourceTraits: [
    {
      ...makeTrait(),
      duration: 2,
      statsModifiers: {
        health: 0,
        focus: 0,
        will: 0,
        perception: 0,
        accuracy: 0,
        evade: 0,
        agility: 3,
      },
    },
  ],
  targetTraits: [
    {
      ...makeTrait(),
      duration: 2,
      abilitiesModifiers: {
        strength: 0,
        dexterity: 0,
        intelligence: 0,
        vigor: -3,
      },
    },
  ],
}

export const SKILL_SHOT: SkillT = {
  ...makeSkill('Skill Shot'),
  imgSrc: SkillShot,
  focusCost: 12,
  check: makeStandardCharacterCheck(['dexterity'], -4),
  combineWeaponDamage: false,
  damageRolls: {
    piercing: makeCharacterRoll(['dexterity'], '1d20'),
    fire: makeCharacterRoll([], '8d2', -8),
  },
  targetTraits: [
    {
      ...makeTrait(),
      duration: 2,
      abilitiesModifiers: {
        strength: 0,
        dexterity: 0,
        intelligence: -2,
        vigor: 0,
      },
    },
  ],
}

export const VANISH: SkillT = {
  ...makeSkill('Vanish'),
  imgSrc: Vanish,
  focusCost: 8,
  check: makeStandardCharacterCheck(['dexterity']),
  combineWeaponDamage: false,
  damageRolls: {},
  target: false,
  sourceTraits: [
    {
      ...makeTrait(),
      duration: 2,
      statsModifiers: {
        health: 0,
        focus: 0,
        will: 0,
        perception: 2,
        agility: -2,
        accuracy: 0,
        evade: 20,
      },
    },
  ],
}

export const SHADOW_STRIKE: SkillT = {
  ...makeSkill('Shadow Strike'),
  imgSrc: ShadowStrike,
  focusCost: 7,
  check: makeStandardCharacterCheck(['evade'], -3),
  combineWeaponDamage: false,
  damageRolls: {
    piercing: makeCharacterRoll(['evade'], '1d6', -6),
  },
}
