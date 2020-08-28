import {
  CharacterSkillCheckKeyT,
  CharacterAbilityKeyT,
} from '../../../types/Character'
import { ItemRarityT } from '../../../types/Item'
import { ArmorTypeT } from '../../../types/Armor'
import { getRandom } from '../../../util/getRandom'
import { ItemModifierValuesT } from '../makeItem'
import { DamageTypeRollsT, DamageElementTypeT } from '../../../types/Damage'
import { shuffleArray, getItemStatRolls } from '../util'
import { WeaponTypeT } from '../../../types/Weapon'
import {
  quickRoll,
  CharacterRollT,
  makeCharacterRoll,
} from '../../../types/Roll2'

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
  daggers: ['dexterity', 'vigor', 'health', 'agility'],
  katana: ['dexterity', 'vigor', 'health', 'agility'],
  rapier: ['dexterity', 'vigor', 'health', 'agility'],
  wand: ['intelligence', 'vigor', 'agility'],
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
    axe: 'Uncommon Axe',
    greataxe: 'Uncommon Greataxe',
    flail: 'Uncommon Flail',
    daggers: 'Uncommon Daggers',
    katana: 'Uncommon Katana',
    rapier: 'Uncommon Rapier',
    wand: 'Uncommon Wand',
    staff: 'Uncommon Staff',
    elementalSword: 'Elemental Sword',
    elementalGreatsword: 'Elemental Greatsword',
    sword: 'Uncommon Sword',
    greatsword: 'Uncommon Greatsword',
    pistol: 'Uncommon Pistol',
    crossbow: 'Uncommon Crossbow',
  },
  rare: {
    fists: 'Unarmed',
    axe: 'Rare Axe',
    greataxe: 'Rare Greataxe',
    flail: 'Rare Flail',
    daggers: 'Rare Daggers',
    katana: 'Rare Katana',
    rapier: 'Rare Rapier',
    wand: 'Rare Wand',
    staff: 'Rare Staff',
    elementalSword: 'Elemental Sword',
    elementalGreatsword: 'Elemental Greatsword',
    sword: 'Rare Sword',
    greatsword: 'Rare Greatsword',
    pistol: 'Rare Pistol',
    crossbow: 'Rare Crossbow',
  },
  legendary: {
    fists: 'Unarmed',
    axe: 'Epic Axe',
    greataxe: 'Epic Greataxe',
    flail: 'Epic Flail',
    daggers: 'Epic Daggers',
    katana: 'Epic Katana',
    rapier: 'Epic Rapier',
    wand: 'Epic Wand',
    staff: 'Epic Staff',
    elementalSword: 'Elemental Sword',
    elementalGreatsword: 'Elemental Greatsword',
    sword: 'Epic Sword',
    greatsword: 'Epic Greatsword',
    pistol: 'Epic Pistol',
    crossbow: 'Epic Crossbow',
  },
  unique: {
    fists: 'Unarmed',
    axe: 'Unique Axe',
    greataxe: 'Unique Greataxe',
    flail: 'Unique Flail',
    daggers: 'Unique Daggers',
    katana: 'Unique Katana',
    rapier: 'Unique Rapier',
    wand: 'Unique Wand',
    staff: 'Unique Staff',
    elementalSword: 'Elemental Sword',
    elementalGreatsword: 'Elemental Greatsword',
    sword: 'Unique Sword',
    greatsword: 'Unique Greatsword',
    pistol: 'Unique Pistol',
    crossbow: 'Unique Crossbow',
  },
  mythic: {
    fists: 'Unarmed',
    axe: 'Mythic Axe',
    greataxe: 'Mythic Greataxe',
    flail: 'Mythic Flail',
    daggers: 'Mythic Daggers',
    katana: 'Mythic Katana',
    rapier: 'Mythic Rapier',
    wand: 'Mythic Wand',
    staff: 'Mythic Staff',
    elementalSword: 'Elemental Sword',
    elementalGreatsword: 'Elemental Greatsword',
    sword: 'Mythic Sword',
    greatsword: 'Mythic Greatsword',
    pistol: 'Mythic Pistol',
    crossbow: 'Mythic Crossbow',
  },
  set: {
    fists: 'Unarmed',
    axe: 'Set Axe',
    greataxe: 'Set Greataxe',
    flail: 'Set Flail',
    daggers: 'Set Daggers',
    katana: 'Set Katana',
    rapier: 'Set Rapier',
    wand: 'Set Wand',
    staff: 'Set Staff',
    elementalSword: 'Elemental Sword',
    elementalGreatsword: 'Elemental Greatsword',
    sword: 'Set Sword',
    greatsword: 'Set Greatsword',
    pistol: 'Set Pistol',
    crossbow: 'Set Crossbow',
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

export const makeDamageRoll = (
  rollString: string,
  modString: string,
  keys: CharacterSkillCheckKeyT[] = [],
  modCoef: number = -1,
  mod: number = 0,
): CharacterRollT => {
  return makeCharacterRoll(
    keys,
    rollString,
    quickRoll(modString) * modCoef + mod,
  )
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
        slashing: makeDamageRoll('1d6', '3d4', ['strength']),
      },
      axe: {
        slashing: makeDamageRoll('1d6', '3d4', ['strength']),
      },
      greataxe: {
        slashing: makeDamageRoll('2d6', '1d6', ['strength']),
      },
      flail: {
        piercing: makeDamageRoll('1d6', '3d4', ['strength']),
      },
      daggers: {
        slashing: makeDamageRoll('2d6', '1d6', ['dexterity']),
      },
      katana: {
        slashing: makeDamageRoll('1d6', '3d4', ['dexterity']),
      },
      rapier: {
        piercing: makeDamageRoll('1d6', '3d4', ['dexterity']),
      },
      wand: {
        [element]: makeDamageRoll('1d6', '3d4', ['intelligence']),
      },
      staff: {
        [element]: makeDamageRoll('2d6', '1d6', ['intelligence']),
      },
      elementalSword: {
        slashing: makeDamageRoll('1d6', '3d6', [
          getRandom(['strength', 'dexterity']),
        ]),
        [element]: makeDamageRoll('1d4', '3d4', ['intelligence']),
      },
      elementalGreatsword: {
        slashing: makeDamageRoll('1d6', '3d6', [
          getRandom(['strength', 'dexterity']),
        ]),
        [element]: makeDamageRoll('1d4', '3d4', ['intelligence']),
      },
      sword: {
        slashing: makeDamageRoll('1d6', '3d6', ['strength']),
      },
      greatsword: {
        slashing: makeDamageRoll('1d6', '3d6', ['strength', 'dexterity']),
      },
      pistol: {
        piercing: makeDamageRoll('1d4', '3d6', ['dexterity']),
        fire: makeDamageRoll('1d4', '3d6', ['intelligence']),
      },
      crossbow: {
        piercing: makeDamageRoll('1d4', '2d6', ['dexterity']),
        fire: makeDamageRoll('1d4', '2d6', ['intelligence']),
      },
    },
    uncommon: {
      fists: {
        slashing: makeDamageRoll('1d6', '3d4', ['strength']),
      },
      axe: {
        slashing: makeDamageRoll('1d6', '3d4', ['strength']),
      },
      greataxe: {
        slashing: makeDamageRoll('2d6', '1d6', ['strength']),
      },
      flail: {
        piercing: makeDamageRoll('1d6', '3d4', ['strength']),
      },
      daggers: {
        slashing: makeDamageRoll('2d6', '1d6', ['dexterity']),
      },
      katana: {
        slashing: makeDamageRoll('1d6', '3d4', ['dexterity']),
      },
      rapier: {
        piercing: makeDamageRoll('1d6', '3d4', ['dexterity']),
      },
      wand: {
        [element]: makeDamageRoll('1d6', '3d4', ['intelligence']),
      },
      staff: {
        [element]: makeDamageRoll('2d6', '1d6', ['intelligence']),
      },
      elementalSword: {
        slashing: makeDamageRoll('1d6', '3d6', [
          getRandom(['strength', 'dexterity']),
        ]),
        [element]: makeDamageRoll('1d4', '3d4', ['intelligence']),
      },
      elementalGreatsword: {
        slashing: makeDamageRoll('1d6', '3d6', [
          getRandom(['strength', 'dexterity']),
        ]),
        [element]: makeDamageRoll('1d4', '3d4', ['intelligence']),
      },
      sword: {
        slashing: makeDamageRoll('1d6', '3d6', ['strength']),
      },
      greatsword: {
        slashing: makeDamageRoll('1d6', '3d6', ['strength', 'dexterity']),
      },
      pistol: {
        piercing: makeDamageRoll('1d4', '3d6', ['dexterity']),
        fire: makeDamageRoll('1d4', '3d6', ['intelligence']),
      },
      crossbow: {
        piercing: makeDamageRoll('1d4', '2d6', ['dexterity']),
        fire: makeDamageRoll('1d4', '2d6', ['intelligence']),
      },
    },
    rare: {
      fists: {
        slashing: makeDamageRoll('1d6', '3d4', ['strength']),
      },
      axe: {
        slashing: makeDamageRoll('1d6', '3d4', ['strength']),
      },
      greataxe: {
        slashing: makeDamageRoll('2d6', '1d6', ['strength']),
      },
      flail: {
        piercing: makeDamageRoll('1d6', '3d4', ['strength']),
      },
      daggers: {
        slashing: makeDamageRoll('2d6', '1d6', ['dexterity']),
      },
      katana: {
        slashing: makeDamageRoll('1d6', '3d4', ['dexterity']),
      },
      rapier: {
        piercing: makeDamageRoll('1d6', '3d4', ['dexterity']),
      },
      wand: {
        [element]: makeDamageRoll('1d6', '3d4', ['intelligence']),
      },
      staff: {
        [element]: makeDamageRoll('2d6', '1d6', ['intelligence']),
      },
      elementalSword: {
        slashing: makeDamageRoll('1d6', '3d6', [
          getRandom(['strength', 'dexterity']),
        ]),
        [element]: makeDamageRoll('1d4', '3d4', ['intelligence']),
      },
      elementalGreatsword: {
        slashing: makeDamageRoll('1d6', '3d6', [
          getRandom(['strength', 'dexterity']),
        ]),
        [element]: makeDamageRoll('1d4', '3d4', ['intelligence']),
      },
      sword: {
        slashing: makeDamageRoll('1d6', '3d6', ['strength']),
      },
      greatsword: {
        slashing: makeDamageRoll('1d6', '3d6', ['strength', 'dexterity']),
      },
      pistol: {
        piercing: makeDamageRoll('1d4', '3d6', ['dexterity']),
        fire: makeDamageRoll('1d4', '3d6', ['intelligence']),
      },
      crossbow: {
        piercing: makeDamageRoll('1d4', '2d6', ['dexterity']),
        fire: makeDamageRoll('1d4', '2d6', ['intelligence']),
      },
    },
    legendary: {
      fists: {
        slashing: makeDamageRoll('1d6', '3d4', ['strength']),
      },
      axe: {
        slashing: makeDamageRoll('1d6', '3d4', ['strength']),
      },
      greataxe: {
        slashing: makeDamageRoll('2d6', '1d6', ['strength']),
      },
      flail: {
        piercing: makeDamageRoll('1d6', '3d4', ['strength']),
      },
      daggers: {
        slashing: makeDamageRoll('2d6', '1d6', ['dexterity']),
      },
      katana: {
        slashing: makeDamageRoll('1d6', '3d4', ['dexterity']),
      },
      rapier: {
        piercing: makeDamageRoll('1d6', '3d4', ['dexterity']),
      },
      wand: {
        [element]: makeDamageRoll('1d6', '3d4', ['intelligence']),
      },
      staff: {
        [element]: makeDamageRoll('2d6', '1d6', ['intelligence']),
      },
      elementalSword: {
        slashing: makeDamageRoll('1d6', '3d6', [
          getRandom(['strength', 'dexterity']),
        ]),
        [element]: makeDamageRoll('1d4', '3d4', ['intelligence']),
      },
      elementalGreatsword: {
        slashing: makeDamageRoll('1d6', '3d6', [
          getRandom(['strength', 'dexterity']),
        ]),
        [element]: makeDamageRoll('1d4', '3d4', ['intelligence']),
      },
      sword: {
        slashing: makeDamageRoll('1d6', '3d6', ['strength']),
      },
      greatsword: {
        slashing: makeDamageRoll('1d6', '3d6', ['strength', 'dexterity']),
      },
      pistol: {
        piercing: makeDamageRoll('1d4', '3d6', ['dexterity']),
        fire: makeDamageRoll('1d4', '3d6', ['intelligence']),
      },
      crossbow: {
        piercing: makeDamageRoll('1d4', '2d6', ['dexterity']),
        fire: makeDamageRoll('1d4', '2d6', ['intelligence']),
      },
    },
    unique: {
      fists: {
        slashing: makeDamageRoll('1d6', '3d4', ['strength']),
      },
      axe: {
        slashing: makeDamageRoll('1d6', '3d4', ['strength']),
      },
      greataxe: {
        slashing: makeDamageRoll('2d6', '1d6', ['strength']),
      },
      flail: {
        piercing: makeDamageRoll('1d6', '3d4', ['strength']),
      },
      daggers: {
        slashing: makeDamageRoll('2d6', '1d6', ['dexterity']),
      },
      katana: {
        slashing: makeDamageRoll('1d6', '3d4', ['dexterity']),
      },
      rapier: {
        piercing: makeDamageRoll('1d6', '3d4', ['dexterity']),
      },
      wand: {
        [element]: makeDamageRoll('1d6', '3d4', ['intelligence']),
      },
      staff: {
        [element]: makeDamageRoll('2d6', '1d6', ['intelligence']),
      },
      elementalSword: {
        slashing: makeDamageRoll('1d6', '3d6', [
          getRandom(['strength', 'dexterity']),
        ]),
        [element]: makeDamageRoll('1d4', '3d4', ['intelligence']),
      },
      elementalGreatsword: {
        slashing: makeDamageRoll('1d6', '3d6', [
          getRandom(['strength', 'dexterity']),
        ]),
        [element]: makeDamageRoll('1d4', '3d4', ['intelligence']),
      },
      sword: {
        slashing: makeDamageRoll('1d6', '3d6', ['strength']),
      },
      greatsword: {
        slashing: makeDamageRoll('1d6', '3d6', ['strength', 'dexterity']),
      },
      pistol: {
        piercing: makeDamageRoll('1d4', '3d6', ['dexterity']),
        fire: makeDamageRoll('1d4', '3d6', ['intelligence']),
      },
      crossbow: {
        piercing: makeDamageRoll('1d4', '2d6', ['dexterity']),
        fire: makeDamageRoll('1d4', '2d6', ['intelligence']),
      },
    },
    mythic: {
      fists: {
        slashing: makeDamageRoll('1d6', '3d4', ['strength']),
      },
      axe: {
        slashing: makeDamageRoll('1d6', '3d4', ['strength']),
      },
      greataxe: {
        slashing: makeDamageRoll('2d6', '1d6', ['strength']),
      },
      flail: {
        piercing: makeDamageRoll('1d6', '3d4', ['strength']),
      },
      daggers: {
        slashing: makeDamageRoll('2d6', '1d6', ['dexterity']),
      },
      katana: {
        slashing: makeDamageRoll('1d6', '3d4', ['dexterity']),
      },
      rapier: {
        piercing: makeDamageRoll('1d6', '3d4', ['dexterity']),
      },
      wand: {
        [element]: makeDamageRoll('1d6', '3d4', ['intelligence']),
      },
      staff: {
        [element]: makeDamageRoll('2d6', '1d6', ['intelligence']),
      },
      elementalSword: {
        slashing: makeDamageRoll('1d6', '3d6', [
          getRandom(['strength', 'dexterity']),
        ]),
        [element]: makeDamageRoll('1d4', '3d4', ['intelligence']),
      },
      elementalGreatsword: {
        slashing: makeDamageRoll('1d6', '3d6', [
          getRandom(['strength', 'dexterity']),
        ]),
        [element]: makeDamageRoll('1d4', '3d4', ['intelligence']),
      },
      sword: {
        slashing: makeDamageRoll('1d6', '3d6', ['strength']),
      },
      greatsword: {
        slashing: makeDamageRoll('1d6', '3d6', ['strength', 'dexterity']),
      },
      pistol: {
        piercing: makeDamageRoll('1d4', '3d6', ['dexterity']),
        fire: makeDamageRoll('1d4', '3d6', ['intelligence']),
      },
      crossbow: {
        piercing: makeDamageRoll('1d4', '2d6', ['dexterity']),
        fire: makeDamageRoll('1d4', '2d6', ['intelligence']),
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
