import {
  CharacterSkillCheckKeyT,
  CharacterAbilityKeyT,
  CharacterResourceKeyT,
} from '../../../types/Character'
import { ItemRarityT } from '../../../types/Item'
import { ArmorTypeT } from '../../../types/Armor'
import { getRandom } from '../../../util/getRandom'
import { ItemModifierValuesT, getRollValue, makeRoll } from '../makeItem'
import { DamageTypeRollsT, DamageElementTypeT } from '../../../types/Damage'
import { makeStaticRoll } from '../../../types/Roll'
import { shuffleArray, getItemStatRolls } from '../util'
import { WeaponTypeT } from '../../../types/Weapon'

export const WeaponRequirementKeys: Record<
  WeaponTypeT,
  CharacterAbilityKeyT[]
> = {
  fists: ['strength'],
  axe: ['strength'],
  greataxe: ['strength'],
  flail: ['strength'],
  daggers: ['dexterity'],
  katana: ['dexterity'],
  rapier: ['dexterity'],
  wand: ['intelligence'],
  staff: ['intelligence'],
  elementalSword: ['strength', 'intelligence'],
  elementalGreatsword: ['strength', 'intelligence'],
  sword: ['strength', 'dexterity'],
  greatsword: ['strength', 'dexterity'],
  pistol: ['dexterity', 'intelligence'],
  crossbow: ['dexterity', 'intelligence'],
}

export const WeaponCosts: Record<WeaponTypeT, number> = {
  fists: 1,
  axe: 1,
  greataxe: 2,
  flail: 1,
  daggers: 2,
  katana: 1,
  rapier: 1,
  wand: 1,
  staff: 2,
  elementalSword: 1,
  elementalGreatsword: 2,
  sword: 1,
  greatsword: 2,
  pistol: 1,
  crossbow: 2,
}

export type WeaponStatKeyT = Record<WeaponTypeT, CharacterSkillCheckKeyT[]>
const weaponStatKeysBase: WeaponStatKeyT = {
  fists: ['strength', 'vigor'],
  axe: ['strength', 'vigor', 'health', 'agility'],
  greataxe: ['strength', 'vigor', 'health', 'agility'],
  flail: ['strength', 'vigor', 'health', 'agility'],
  daggers: ['dexterity', 'vigor', 'health', 'speed', 'agility'],
  katana: ['dexterity', 'vigor', 'health', 'speed', 'agility'],
  rapier: ['dexterity', 'vigor', 'health', 'speed', 'agility'],
  wand: ['intelligence', 'vigor', 'speed', 'agility'],
  staff: ['intelligence', 'vigor', 'perception', 'will'],
  elementalSword: ['intelligence', 'vigor', 'strength', 'will'],
  elementalGreatsword: ['intelligence', 'vigor', 'strength', 'will'],
  sword: ['strength', 'intelligence', 'health', 'agility'],
  greatsword: ['strength', 'intelligence', 'health', 'vigor'],
  pistol: ['dexterity', 'intelligence', 'perception', 'vigor'],
  crossbow: ['dexterity', 'intelligence', 'perception', 'vigor'],
}
export const WeaponRarityStatKeys: Record<ItemRarityT, WeaponStatKeyT> = {
  common: weaponStatKeysBase,
  uncommon: weaponStatKeysBase,
  rare: weaponStatKeysBase,
  legendary: weaponStatKeysBase,
  unique: weaponStatKeysBase,
  mythic: weaponStatKeysBase,
  set: weaponStatKeysBase,
}

export type WeaponNameKeyT = Record<WeaponTypeT, string>
export const WeaponNameKeys = (): Record<ItemRarityT, WeaponNameKeyT> => ({
  common: {
    fists: 'Unarmed',
    axe: 'Common Axe',
    greataxe: 'Common Greataxe',
    flail: 'Common Flail',
    daggers: 'Common Daggers',
    katana: 'Common Katana',
    rapier: 'Common Rapier',
    wand: 'Common Wand',
    staff: 'Common Staff',
    elementalSword: 'Elemental Sword',
    elementalGreatsword: 'Elemental Greatsword',
    sword: 'Common Sword',
    greatsword: 'Common Greatsword',
    pistol: 'Common Pistol',
    crossbow: 'Common Crossbow',
  },
  uncommon: {
    fists: 'Unarmed',
    axe: 'Common Axe',
    greataxe: 'Common Greataxe',
    flail: 'Common Flail',
    daggers: 'Common Daggers',
    katana: 'Common Katana',
    rapier: 'Common Rapier',
    wand: 'Common Wand',
    staff: 'Common Staff',
    elementalSword: 'Elemental Sword',
    elementalGreatsword: 'Elemental Greatsword',
    sword: 'Common Sword',
    greatsword: 'Common Greatsword',
    pistol: 'Common Pistol',
    crossbow: 'Common Crossbow',
  },
  rare: {
    fists: 'Unarmed',
    axe: 'Common Axe',
    greataxe: 'Common Greataxe',
    flail: 'Common Flail',
    daggers: 'Common Daggers',
    katana: 'Common Katana',
    rapier: 'Common Rapier',
    wand: 'Common Wand',
    staff: 'Common Staff',
    elementalSword: 'Elemental Sword',
    elementalGreatsword: 'Elemental Greatsword',
    sword: 'Common Sword',
    greatsword: 'Common Greatsword',
    pistol: 'Common Pistol',
    crossbow: 'Common Crossbow',
  },
  legendary: {
    fists: 'Unarmed',
    axe: 'Common Axe',
    greataxe: 'Common Greataxe',
    flail: 'Common Flail',
    daggers: 'Common Daggers',
    katana: 'Common Katana',
    rapier: 'Common Rapier',
    wand: 'Common Wand',
    staff: 'Common Staff',
    elementalSword: 'Elemental Sword',
    elementalGreatsword: 'Elemental Greatsword',
    sword: 'Common Sword',
    greatsword: 'Common Greatsword',
    pistol: 'Common Pistol',
    crossbow: 'Common Crossbow',
  },
  unique: {
    fists: 'Unarmed',
    axe: 'Common Axe',
    greataxe: 'Common Greataxe',
    flail: 'Common Flail',
    daggers: 'Common Daggers',
    katana: 'Common Katana',
    rapier: 'Common Rapier',
    wand: 'Common Wand',
    staff: 'Common Staff',
    elementalSword: 'Elemental Sword',
    elementalGreatsword: 'Elemental Greatsword',
    sword: 'Common Sword',
    greatsword: 'Common Greatsword',
    pistol: 'Common Pistol',
    crossbow: 'Common Crossbow',
  },
  mythic: {
    fists: 'Unarmed',
    axe: 'Common Axe',
    greataxe: 'Common Greataxe',
    flail: 'Common Flail',
    daggers: 'Common Daggers',
    katana: 'Common Katana',
    rapier: 'Common Rapier',
    wand: 'Common Wand',
    staff: 'Common Staff',
    elementalSword: 'Elemental Sword',
    elementalGreatsword: 'Elemental Greatsword',
    sword: 'Common Sword',
    greatsword: 'Common Greatsword',
    pistol: 'Common Pistol',
    crossbow: 'Common Crossbow',
  },
  set: {
    fists: 'Unarmed',
    axe: 'Common Axe',
    greataxe: 'Common Greataxe',
    flail: 'Common Flail',
    daggers: 'Common Daggers',
    katana: 'Common Katana',
    rapier: 'Common Rapier',
    wand: 'Common Wand',
    staff: 'Common Staff',
    elementalSword: 'Elemental Sword',
    elementalGreatsword: 'Elemental Greatsword',
    sword: 'Common Sword',
    greatsword: 'Common Greatsword',
    pistol: 'Common Pistol',
    crossbow: 'Common Crossbow',
  },
})

export type ArmorStatCountT = Record<ArmorTypeT, number[]>
export const WeaponRarityStatCounts: Record<ItemRarityT, number> = {
  common: 1,
  uncommon: 2,
  rare: 3,
  legendary: 4,
  unique: 5,
  mythic: 6,
  set: 6,
}

export type WeaponDamagesT = Record<WeaponTypeT, DamageTypeRollsT>
export const WeaponDamages = (): Record<ItemRarityT, WeaponDamagesT> => {
  const element: DamageElementTypeT = getRandom<DamageElementTypeT>([
    'fire',
    'blood',
    'dark',
    'light',
  ])
  return {
    common: {
      fists: {
        slashing: makeRoll('1d6', getRollValue('3d4') * -1, ['strength']),
      },
      axe: {
        slashing: makeRoll('1d6', getRollValue('3d4') * -1, ['strength']),
      },
      greataxe: {
        slashing: makeRoll('2d6', getRollValue('1d6') * -1, ['strength']),
      },
      flail: {
        piercing: makeRoll('1d6', getRollValue('3d4') * -1, ['strength']),
      },
      daggers: {
        slashing: makeRoll('2d6', getRollValue('1d6') * -1, ['dexterity']),
      },
      katana: {
        slashing: makeRoll('1d6', getRollValue('3d4') * -1, ['dexterity']),
      },
      rapier: {
        piercing: makeRoll('1d6', getRollValue('3d4') * -1, ['dexterity']),
      },
      wand: {
        [element]: makeRoll('1d6', getRollValue('3d4') * -1, ['intelligence']),
      },
      staff: {
        [element]: makeRoll('2d6', getRollValue('1d6') * -1, ['intelligence']),
      },
      elementalSword: {
        slashing: makeRoll('1d6', getRollValue('3d6') * -1, [
          getRandom(['strength', 'dexterity']),
        ]),
        [element]: makeRoll('1d4', getRollValue('3d6') * -1, ['intelligence']),
      },
      elementalGreatsword: {
        slashing: makeRoll('1d6', getRollValue('3d6') * -1, [
          getRandom(['strength', 'dexterity']),
        ]),
        [element]: makeRoll('1d4', getRollValue('3d6') * -1, ['intelligence']),
      },
      sword: {
        slashing: makeRoll('1d6', getRollValue('3d6') * -1, ['strength']),
      },
      greatsword: {
        slashing: makeRoll('1d6', getRollValue('3d6') * -1, [
          'strength',
          'dexterity',
        ]),
      },
      pistol: {
        piercing: makeRoll('1d4', getRollValue('3d6') * -1, ['dexterity']),
        fire: makeRoll('1d4', getRollValue('3d6') * -1, ['intelligence']),
      },
      crossbow: {
        piercing: makeRoll('1d4', getRollValue('2d6') * -1, ['dexterity']),
        blood: makeRoll('1d4', getRollValue('2d6') * -1, ['intelligence']),
      },
    },
    uncommon: {
      fists: {
        slashing: makeRoll('1d6', getRollValue('3d4') * -1, ['strength']),
      },
      axe: {
        slashing: makeRoll('1d6', getRollValue('3d4') * -1, ['strength']),
      },
      greataxe: {
        slashing: makeRoll('2d6', getRollValue('1d6') * -1, ['strength']),
      },
      flail: {
        piercing: makeRoll('1d6', getRollValue('3d4') * -1, ['strength']),
      },
      daggers: {
        slashing: makeRoll('2d6', getRollValue('1d6') * -1, ['dexterity']),
      },
      katana: {
        slashing: makeRoll('1d6', getRollValue('3d4') * -1, ['dexterity']),
      },
      rapier: {
        piercing: makeRoll('1d6', getRollValue('3d4') * -1, ['dexterity']),
      },
      wand: {
        [element]: makeRoll('1d6', getRollValue('3d4') * -1, ['intelligence']),
      },
      staff: {
        [element]: makeRoll('2d6', getRollValue('1d6') * -1, ['intelligence']),
      },
      elementalSword: {
        slashing: makeRoll('1d6', getRollValue('3d6') * -1, [
          getRandom(['strength', 'dexterity']),
        ]),
        [element]: makeRoll('1d4', getRollValue('3d6') * -1, ['intelligence']),
      },
      elementalGreatsword: {
        slashing: makeRoll('1d6', getRollValue('3d6') * -1, [
          getRandom(['strength', 'dexterity']),
        ]),
        [element]: makeRoll('1d4', getRollValue('3d6') * -1, ['intelligence']),
      },
      sword: {
        slashing: makeRoll('1d6', getRollValue('3d6') * -1, ['strength']),
      },
      greatsword: {
        slashing: makeRoll('1d6', getRollValue('3d6') * -1, [
          'strength',
          'dexterity',
        ]),
      },
      pistol: {
        piercing: makeRoll('1d4', getRollValue('3d6') * -1, ['dexterity']),
        fire: makeRoll('1d4', getRollValue('3d6') * -1, ['intelligence']),
      },
      crossbow: {
        piercing: makeRoll('1d4', getRollValue('2d6') * -1, ['dexterity']),
        blood: makeRoll('1d4', getRollValue('2d6') * -1, ['intelligence']),
      },
    },
    rare: {
      fists: {
        slashing: makeRoll('1d6', getRollValue('3d4') * -1, ['strength']),
      },
      axe: {
        slashing: makeRoll('1d6', getRollValue('3d4') * -1, ['strength']),
      },
      greataxe: {
        slashing: makeRoll('2d6', getRollValue('1d6') * -1, ['strength']),
      },
      flail: {
        piercing: makeRoll('1d6', getRollValue('3d4') * -1, ['strength']),
      },
      daggers: {
        slashing: makeRoll('2d6', getRollValue('1d6') * -1, ['dexterity']),
      },
      katana: {
        slashing: makeRoll('1d6', getRollValue('3d4') * -1, ['dexterity']),
      },
      rapier: {
        piercing: makeRoll('1d6', getRollValue('3d4') * -1, ['dexterity']),
      },
      wand: {
        [element]: makeRoll('1d6', getRollValue('3d4') * -1, ['intelligence']),
      },
      staff: {
        [element]: makeRoll('2d6', getRollValue('1d6') * -1, ['intelligence']),
      },
      elementalSword: {
        slashing: makeRoll('1d6', getRollValue('3d6') * -1, [
          getRandom(['strength', 'dexterity']),
        ]),
        [element]: makeRoll('1d4', getRollValue('3d6') * -1, ['intelligence']),
      },
      elementalGreatsword: {
        slashing: makeRoll('1d6', getRollValue('3d6') * -1, [
          getRandom(['strength', 'dexterity']),
        ]),
        [element]: makeRoll('1d4', getRollValue('3d6') * -1, ['intelligence']),
      },
      sword: {
        slashing: makeRoll('1d6', getRollValue('3d6') * -1, ['strength']),
      },
      greatsword: {
        slashing: makeRoll('1d6', getRollValue('3d6') * -1, [
          'strength',
          'dexterity',
        ]),
      },
      pistol: {
        piercing: makeRoll('1d4', getRollValue('3d6') * -1, ['dexterity']),
        fire: makeRoll('1d4', getRollValue('3d6') * -1, ['intelligence']),
      },
      crossbow: {
        piercing: makeRoll('1d4', getRollValue('2d6') * -1, ['dexterity']),
        blood: makeRoll('1d4', getRollValue('2d6') * -1, ['intelligence']),
      },
    },
    legendary: {
      fists: {
        slashing: makeRoll('1d6', getRollValue('3d4') * -1, ['strength']),
      },
      axe: {
        slashing: makeRoll('1d6', getRollValue('3d4') * -1, ['strength']),
      },
      greataxe: {
        slashing: makeRoll('2d6', getRollValue('1d6') * -1, ['strength']),
      },
      flail: {
        piercing: makeRoll('1d6', getRollValue('3d4') * -1, ['strength']),
      },
      daggers: {
        slashing: makeRoll('2d6', getRollValue('1d6') * -1, ['dexterity']),
      },
      katana: {
        slashing: makeRoll('1d6', getRollValue('3d4') * -1, ['dexterity']),
      },
      rapier: {
        piercing: makeRoll('1d6', getRollValue('3d4') * -1, ['dexterity']),
      },
      wand: {
        [element]: makeRoll('1d6', getRollValue('3d4') * -1, ['intelligence']),
      },
      staff: {
        [element]: makeRoll('2d6', getRollValue('1d6') * -1, ['intelligence']),
      },
      elementalSword: {
        slashing: makeRoll('1d6', getRollValue('3d6') * -1, [
          getRandom(['strength', 'dexterity']),
        ]),
        [element]: makeRoll('1d4', getRollValue('3d6') * -1, ['intelligence']),
      },
      elementalGreatsword: {
        slashing: makeRoll('1d6', getRollValue('3d6') * -1, [
          getRandom(['strength', 'dexterity']),
        ]),
        [element]: makeRoll('1d4', getRollValue('3d6') * -1, ['intelligence']),
      },
      sword: {
        slashing: makeRoll('1d6', getRollValue('3d6') * -1, ['strength']),
      },
      greatsword: {
        slashing: makeRoll('1d6', getRollValue('3d6') * -1, [
          'strength',
          'dexterity',
        ]),
      },
      pistol: {
        piercing: makeRoll('1d4', getRollValue('3d6') * -1, ['dexterity']),
        fire: makeRoll('1d4', getRollValue('3d6') * -1, ['intelligence']),
      },
      crossbow: {
        piercing: makeRoll('1d4', getRollValue('2d6') * -1, ['dexterity']),
        blood: makeRoll('1d4', getRollValue('2d6') * -1, ['intelligence']),
      },
    },
    unique: {
      fists: {
        slashing: makeRoll('1d6', getRollValue('3d4') * -1, ['strength']),
      },
      axe: {
        slashing: makeRoll('1d6', getRollValue('3d4') * -1, ['strength']),
      },
      greataxe: {
        slashing: makeRoll('2d6', getRollValue('1d6') * -1, ['strength']),
      },
      flail: {
        piercing: makeRoll('1d6', getRollValue('3d4') * -1, ['strength']),
      },
      daggers: {
        slashing: makeRoll('2d6', getRollValue('1d6') * -1, ['dexterity']),
      },
      katana: {
        slashing: makeRoll('1d6', getRollValue('3d4') * -1, ['dexterity']),
      },
      rapier: {
        piercing: makeRoll('1d6', getRollValue('3d4') * -1, ['dexterity']),
      },
      wand: {
        [element]: makeRoll('1d6', getRollValue('3d4') * -1, ['intelligence']),
      },
      staff: {
        [element]: makeRoll('2d6', getRollValue('1d6') * -1, ['intelligence']),
      },
      elementalSword: {
        slashing: makeRoll('1d6', getRollValue('3d6') * -1, [
          getRandom(['strength', 'dexterity']),
        ]),
        [element]: makeRoll('1d4', getRollValue('3d6') * -1, ['intelligence']),
      },
      elementalGreatsword: {
        slashing: makeRoll('1d6', getRollValue('3d6') * -1, [
          getRandom(['strength', 'dexterity']),
        ]),
        [element]: makeRoll('1d4', getRollValue('3d6') * -1, ['intelligence']),
      },
      sword: {
        slashing: makeRoll('1d6', getRollValue('3d6') * -1, ['strength']),
      },
      greatsword: {
        slashing: makeRoll('1d6', getRollValue('3d6') * -1, [
          'strength',
          'dexterity',
        ]),
      },
      pistol: {
        piercing: makeRoll('1d4', getRollValue('3d6') * -1, ['dexterity']),
        fire: makeRoll('1d4', getRollValue('3d6') * -1, ['intelligence']),
      },
      crossbow: {
        piercing: makeRoll('1d4', getRollValue('2d6') * -1, ['dexterity']),
        blood: makeRoll('1d4', getRollValue('2d6') * -1, ['intelligence']),
      },
    },
    mythic: {
      fists: {
        slashing: makeRoll('1d6', getRollValue('3d4') * -1, ['strength']),
      },
      axe: {
        slashing: makeRoll('1d6', getRollValue('3d4') * -1, ['strength']),
      },
      greataxe: {
        slashing: makeRoll('2d6', getRollValue('1d6') * -1, ['strength']),
      },
      flail: {
        piercing: makeRoll('1d6', getRollValue('3d4') * -1, ['strength']),
      },
      daggers: {
        slashing: makeRoll('2d6', getRollValue('1d6') * -1, ['dexterity']),
      },
      katana: {
        slashing: makeRoll('1d6', getRollValue('3d4') * -1, ['dexterity']),
      },
      rapier: {
        piercing: makeRoll('1d6', getRollValue('3d4') * -1, ['dexterity']),
      },
      wand: {
        [element]: makeRoll('1d6', getRollValue('3d4') * -1, ['intelligence']),
      },
      staff: {
        [element]: makeRoll('2d6', getRollValue('1d6') * -1, ['intelligence']),
      },
      elementalSword: {
        slashing: makeRoll('1d6', getRollValue('3d6') * -1, [
          getRandom(['strength', 'dexterity']),
        ]),
        [element]: makeRoll('1d4', getRollValue('3d6') * -1, ['intelligence']),
      },
      elementalGreatsword: {
        slashing: makeRoll('1d6', getRollValue('3d6') * -1, [
          getRandom(['strength', 'dexterity']),
        ]),
        [element]: makeRoll('1d4', getRollValue('3d6') * -1, ['intelligence']),
      },
      sword: {
        slashing: makeRoll('1d6', getRollValue('3d6') * -1, ['strength']),
      },
      greatsword: {
        slashing: makeRoll('1d6', getRollValue('3d6') * -1, [
          'strength',
          'dexterity',
        ]),
      },
      pistol: {
        piercing: makeRoll('1d4', getRollValue('3d6') * -1, ['dexterity']),
        fire: makeRoll('1d4', getRollValue('3d6') * -1, ['intelligence']),
      },
      crossbow: {
        piercing: makeRoll('1d4', getRollValue('2d6') * -1, ['dexterity']),
        blood: makeRoll('1d4', getRollValue('2d6') * -1, ['intelligence']),
      },
    },
    set: {
      fists: {},
      axe: {},
      greataxe: {},
      flail: {},
      daggers: {},
      katana: {},
      rapier: {},
      wand: {},
      staff: {},
      elementalSword: {},
      elementalGreatsword: {},
      sword: {},
      greatsword: {},
      pistol: {},
      crossbow: {},
    },
  }
}

export const getWeaponStatRolls = (
  type: WeaponTypeT,
  rarity: ItemRarityT,
  requirementScore: number,
): ItemModifierValuesT => {
  const keys = shuffleArray(WeaponRarityStatKeys[rarity][type])
  const counts = WeaponRarityStatCounts[rarity]
  return getItemStatRolls(keys, counts, requirementScore)
}
