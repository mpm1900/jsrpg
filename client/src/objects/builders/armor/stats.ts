import {
  CharacterSkillCheckKeyT,
  CharacterAbilityKeyT,
  CharacterResourceKeyT,
} from '../../../types/Character'
import { ItemRarityT } from '../../../types/Item'
import { ArmorTypeT } from '../../../types/Armor'
import { getRandom } from '../../../util/getRandom'
import { ItemModifierValuesT } from '../makeItem'
import { ArmorUniqueNames } from './names'
import { DamageTypeRollsT } from '../../../types/Damage'
import { shuffleArray, getItemStatRolls } from '../util'
import { quickRoll, makeCharacterRoll } from '../../../types/Roll2'

export const ArmorRequirementKeys: Record<
  ArmorTypeT,
  CharacterAbilityKeyT[]
> = {
  helmet: ['strength', 'dexterity'],
  cowl: ['dexterity', 'intelligence'],
  chestplate: ['strength', 'vigor'],
  robe: ['dexterity', 'intelligence'],
  gloves: ['strength', 'dexterity', 'intelligence'],
  ring: ['strength', 'dexterity', 'intelligence'],
  boots: ['strength', 'dexterity', 'intelligence'],
}

export const ArmorCostsT: Record<ArmorTypeT, number> = {
  helmet: 1,
  cowl: 1,
  chestplate: 1,
  robe: 1,
  gloves: 2,
  ring: 1,
  boots: 2,
}

export const ArmorResourcesT: Record<ArmorTypeT, CharacterResourceKeyT> = {
  helmet: 'heads',
  cowl: 'heads',
  chestplate: 'bodies',
  robe: 'bodies',
  gloves: 'hands',
  ring: 'fingers',
  boots: 'feet',
}

export type ArmorStatKeyT = Record<ArmorTypeT, CharacterSkillCheckKeyT[]>
const armorStatKeysBase: ArmorStatKeyT = {
  helmet: ['strength', 'intelligence', 'vigor', 'accuracy'],
  cowl: ['dexterity', 'intelligence', 'agility', 'evade'],
  chestplate: ['strength', 'intelligence', 'vigor'],
  robe: ['dexterity', 'intelligence', 'agility', 'evade'],
  gloves: [
    'strength',
    'dexterity',
    'intelligence',
    'vigor',
    'health',
    'focus',
    'agility',
    'accuracy',
  ],
  ring: [
    'strength',
    'dexterity',
    'intelligence',
    'vigor',
    'health',
    'focus',
    'will',
    'perception',
    'agility',
    'accuracy',
    'evade',
  ],
  boots: [
    'strength',
    'dexterity',
    'intelligence',
    'vigor',
    'health',
    'focus',
    'agility',
    'evade',
  ],
}
export const ArmorRarityStatKeys: Record<ItemRarityT, ArmorStatKeyT> = {
  common: armorStatKeysBase,
  uncommon: armorStatKeysBase,
  rare: armorStatKeysBase,
  legendary: armorStatKeysBase,
  unique: armorStatKeysBase,
  mythic: armorStatKeysBase,
  set: armorStatKeysBase,
}

export type ArmorNameKeyT = Record<ArmorTypeT, string>
export const ArmorNameKeys = (): Record<ItemRarityT, ArmorNameKeyT> => ({
  common: {
    helmet: 'Common Helmet',
    cowl: 'Common Hood',
    chestplate: 'Common Chestplate',
    robe: 'Common Robe',
    gloves: 'Common Gloves',
    ring: 'Common Ring',
    boots: 'Common Boots',
  },
  uncommon: {
    helmet: 'Uncommon Helmet',
    cowl: 'Uncommon Hood',
    chestplate: 'Uncommon Chestplate',
    robe: 'Uncommon Robe',
    gloves: 'Uncommon Gloves',
    ring: 'Uncommon Ring',
    boots: 'Uncommon Boots',
  },
  rare: {
    helmet: 'Rare Helmet',
    cowl: 'Rare Hood',
    chestplate: 'Rare Chestplate',
    robe: 'Rare Robe',
    gloves: 'Rare Gloves',
    ring: 'Rare Ring',
    boots: 'Rare Boots',
  },
  legendary: {
    helmet: 'Epic Helmet',
    cowl: 'Epic Hood',
    chestplate: 'Epic Chestplate',
    robe: 'Epic Robe',
    gloves: 'Epic Gloves',
    ring: 'Epic Ring',
    boots: 'Epic Boots',
  },
  unique: {
    helmet: getRandom(ArmorUniqueNames.helmet),
    cowl: getRandom(ArmorUniqueNames.cowl),
    chestplate: getRandom(ArmorUniqueNames.chestplate),
    robe: getRandom(ArmorUniqueNames.robe),
    gloves: getRandom(ArmorUniqueNames.gloves),
    ring: getRandom(ArmorUniqueNames.ring),
    boots: getRandom(ArmorUniqueNames.boots),
  },
  mythic: {
    helmet: 'Mythic Helmet',
    cowl: 'Mythic Hood',
    chestplate: 'Mythic Chestplate',
    robe: 'Mythic Robe',
    gloves: 'Mythic Gloves',
    ring: 'Mythic Ring',
    boots: 'Mythic Boots',
  },
  set: {
    helmet: 'Set Helmet',
    cowl: 'Set Hood',
    chestplate: 'Set Chestplate',
    robe: 'Set Robe',
    gloves: 'Set Gloves',
    ring: 'Set Ring',
    boots: 'Set Boots',
  },
})

export type ArmorStatCountT = Record<ArmorTypeT, number[]>
export const ArmorRarityStatCounts: Record<ItemRarityT, number> = {
  common: 0,
  uncommon: 1,
  rare: 2,
  legendary: 3,
  unique: 4,
  mythic: 5,
  set: 5,
}

export const makeStaticRoll = (str: string) =>
  makeCharacterRoll([], '', quickRoll(str))
export const makeRoll = (str: string) => makeCharacterRoll([], str)
export type ArmorResistanceT = Record<ArmorTypeT, DamageTypeRollsT>
export const ArmorResistances = (): Record<ItemRarityT, ArmorResistanceT> => ({
  common: {
    helmet: {
      slashing: makeStaticRoll('1d2-1'),
      piercing: makeStaticRoll('1d2-1'),
    },
    cowl: {
      blood: makeStaticRoll('1d2-1'),
      light: makeStaticRoll('1d2-1'),
      dark: makeStaticRoll('1d2-1'),
    },
    chestplate: {
      slashing: makeStaticRoll('1d2-1'),
      piercing: makeStaticRoll('1d2-1'),
      fire: makeStaticRoll('1d2-1'),
    },
    robe: {
      fire: makeStaticRoll('1d2-1'),
      blood: makeStaticRoll('1d2-1'),
      light: makeStaticRoll('1d2-1'),
      dark: makeStaticRoll('1d2-1'),
    },
    gloves: {
      slashing: makeStaticRoll('1d2-1'),
      piercing: makeStaticRoll('1d2-1'),
    },
    ring: {
      blood: makeStaticRoll('1d2-1'),
      light: makeStaticRoll('1d2-1'),
      dark: makeStaticRoll('1d2-1'),
    },
    boots: {
      slashing: makeStaticRoll('1d2-1'),
      piercing: makeStaticRoll('1d2-1'),
    },
  },
  uncommon: {
    helmet: {
      slashing: makeStaticRoll('1d3-1'),
      piercing: makeStaticRoll('1d3-1'),
    },
    cowl: {
      blood: makeStaticRoll('1d3-1'),
      light: makeStaticRoll('1d3-1'),
      dark: makeStaticRoll('1d3-1'),
    },
    chestplate: {
      slashing: makeStaticRoll('1d3-1'),
      piercing: makeStaticRoll('1d3-1'),
      fire: makeStaticRoll('1d3-1'),
    },
    robe: {
      fire: makeStaticRoll('1d3-1'),
      blood: makeStaticRoll('1d3-1'),
      light: makeStaticRoll('1d3-1'),
      dark: makeStaticRoll('1d3-1'),
    },
    gloves: {
      slashing: makeStaticRoll('1d3-1'),
      piercing: makeStaticRoll('1d3-1'),
    },
    ring: {
      blood: makeStaticRoll('1d3-1'),
      light: makeStaticRoll('1d3-1'),
      dark: makeStaticRoll('1d3-1'),
    },
    boots: {
      slashing: makeStaticRoll('1d3-1'),
      piercing: makeStaticRoll('1d3-1'),
    },
  },
  rare: {
    helmet: {
      slashing: makeStaticRoll('1d4-1'),
      piercing: makeStaticRoll('1d4-1'),
    },
    cowl: {
      blood: makeStaticRoll('1d4-1'),
      light: makeStaticRoll('1d4-1'),
      dark: makeStaticRoll('1d4-1'),
    },
    chestplate: {
      slashing: makeStaticRoll('1d4-1'),
      piercing: makeStaticRoll('1d4-1'),
      fire: makeStaticRoll('1d4-1'),
    },
    robe: {
      fire: makeStaticRoll('1d4-1'),
      blood: makeStaticRoll('1d4-1'),
      light: makeStaticRoll('1d4-1'),
      dark: makeStaticRoll('1d4-1'),
    },
    gloves: {
      slashing: makeStaticRoll('1d4-1'),
      piercing: makeStaticRoll('1d4-1'),
    },
    ring: {
      blood: makeStaticRoll('1d4-1'),
      light: makeStaticRoll('1d4-1'),
      dark: makeStaticRoll('1d4-1'),
    },
    boots: {
      slashing: makeStaticRoll('1d4-1'),
      piercing: makeStaticRoll('1d4-1'),
    },
  },
  legendary: {
    helmet: {
      slashing: makeStaticRoll('1d5-1'),
      piercing: makeStaticRoll('1d5-1'),
    },
    cowl: {
      blood: makeStaticRoll('1d5-1'),
      light: makeStaticRoll('1d5-1'),
      dark: makeStaticRoll('1d5-1'),
    },
    chestplate: {
      slashing: makeStaticRoll('1d5-1'),
      piercing: makeStaticRoll('1d5-1'),
      fire: makeStaticRoll('1d5-1'),
    },
    robe: {
      fire: makeStaticRoll('1d5-1'),
      blood: makeStaticRoll('1d5-1'),
      light: makeStaticRoll('1d5-1'),
      dark: makeStaticRoll('1d5-1'),
    },
    gloves: {
      slashing: makeStaticRoll('1d5-1'),
      piercing: makeStaticRoll('1d5-1'),
    },
    ring: {
      fire: makeStaticRoll('1d5-1'),
      blood: makeStaticRoll('1d5-1'),
      light: makeStaticRoll('1d5-1'),
      dark: makeStaticRoll('1d5-1'),
    },
    boots: {
      slashing: makeStaticRoll('1d5-1'),
      piercing: makeStaticRoll('1d5-1'),
    },
  },
  unique: {
    helmet: {
      slashing: makeRoll('1d6'),
      piercing: makeRoll('1d6'),
      fire: makeRoll('1d6'),
      blood: makeRoll('1d6'),
      light: makeRoll('1d6'),
      dark: makeRoll('1d6'),
    },
    cowl: {
      slashing: makeRoll('1d6'),
      piercing: makeRoll('1d6'),
      fire: makeRoll('1d6'),
      blood: makeRoll('1d6'),
      light: makeRoll('1d6'),
      dark: makeRoll('1d6'),
    },
    chestplate: {
      slashing: makeRoll('1d6'),
      piercing: makeRoll('1d6'),
      fire: makeRoll('1d6'),
      blood: makeRoll('1d6'),
      light: makeRoll('1d6'),
      dark: makeRoll('1d6'),
    },
    robe: {
      slashing: makeRoll('1d6'),
      piercing: makeRoll('1d6'),
      fire: makeRoll('1d6'),
      blood: makeRoll('1d6'),
      light: makeRoll('1d6'),
      dark: makeRoll('1d6'),
    },
    gloves: {
      slashing: makeStaticRoll('1d2-1'),
      piercing: makeStaticRoll('1d2-1'),
      fire: makeRoll('1d6'),
      blood: makeRoll('1d6'),
      light: makeRoll('1d6'),
      dark: makeRoll('1d6'),
    },
    ring: {
      slashing: makeRoll('1d6'),
      piercing: makeRoll('1d6'),
      fire: makeRoll('1d6'),
      blood: makeRoll('1d6'),
      light: makeRoll('1d6'),
      dark: makeRoll('1d6'),
    },
    boots: {
      slashing: makeRoll('1d6'),
      piercing: makeRoll('1d6'),
      fire: makeRoll('1d6'),
      blood: makeRoll('1d6'),
      light: makeRoll('1d6'),
      dark: makeRoll('1d6'),
    },
  },
  mythic: {
    helmet: {
      slashing: makeRoll('1d6'),
      piercing: makeRoll('1d6'),
      fire: makeRoll('1d6'),
      blood: makeRoll('1d6'),
      light: makeRoll('1d6'),
      dark: makeRoll('1d6'),
    },
    cowl: {
      slashing: makeRoll('1d6'),
      piercing: makeRoll('1d6'),
      fire: makeRoll('1d6'),
      blood: makeRoll('1d6'),
      light: makeRoll('1d6'),
      dark: makeRoll('1d6'),
    },
    chestplate: {
      slashing: makeRoll('1d6'),
      piercing: makeRoll('1d6'),
      fire: makeRoll('1d6'),
      blood: makeRoll('1d6'),
      light: makeRoll('1d6'),
      dark: makeRoll('1d6'),
    },
    robe: {
      slashing: makeRoll('1d6'),
      piercing: makeRoll('1d6'),
      fire: makeRoll('1d6'),
      blood: makeRoll('1d6'),
      light: makeRoll('1d6'),
      dark: makeRoll('1d6'),
    },
    gloves: {
      slashing: makeStaticRoll('1d2-1'),
      piercing: makeStaticRoll('1d2-1'),
      fire: makeRoll('1d6'),
      blood: makeRoll('1d6'),
      light: makeRoll('1d6'),
      dark: makeRoll('1d6'),
    },
    ring: {
      slashing: makeRoll('1d6'),
      piercing: makeRoll('1d6'),
      fire: makeRoll('1d6'),
      blood: makeRoll('1d6'),
      light: makeRoll('1d6'),
      dark: makeRoll('1d6'),
    },
    boots: {
      slashing: makeRoll('1d6'),
      piercing: makeRoll('1d6'),
      fire: makeRoll('1d6'),
      blood: makeRoll('1d6'),
      light: makeRoll('1d6'),
      dark: makeRoll('1d6'),
    },
  },
  set: {
    helmet: {
      slashing: makeRoll('1d6'),
      piercing: makeRoll('1d6'),
      fire: makeRoll('1d6'),
      blood: makeRoll('1d6'),
      light: makeRoll('1d6'),
      dark: makeRoll('1d6'),
    },
    cowl: {
      slashing: makeRoll('1d6'),
      piercing: makeRoll('1d6'),
      fire: makeRoll('1d6'),
      blood: makeRoll('1d6'),
      light: makeRoll('1d6'),
      dark: makeRoll('1d6'),
    },
    chestplate: {
      slashing: makeRoll('1d6'),
      piercing: makeRoll('1d6'),
      fire: makeRoll('1d6'),
      blood: makeRoll('1d6'),
      light: makeRoll('1d6'),
      dark: makeRoll('1d6'),
    },
    robe: {
      slashing: makeRoll('1d6'),
      piercing: makeRoll('1d6'),
      fire: makeRoll('1d6'),
      blood: makeRoll('1d6'),
      light: makeRoll('1d6'),
      dark: makeRoll('1d6'),
    },
    gloves: {
      slashing: makeStaticRoll('1d2-1'),
      piercing: makeStaticRoll('1d2-1'),
      fire: makeRoll('1d6'),
      blood: makeRoll('1d6'),
      light: makeRoll('1d6'),
      dark: makeRoll('1d6'),
    },
    ring: {
      slashing: makeRoll('1d6'),
      piercing: makeRoll('1d6'),
      fire: makeRoll('1d6'),
      blood: makeRoll('1d6'),
      light: makeRoll('1d6'),
      dark: makeRoll('1d6'),
    },
    boots: {
      slashing: makeRoll('1d6'),
      piercing: makeRoll('1d6'),
      fire: makeRoll('1d6'),
      blood: makeRoll('1d6'),
      light: makeRoll('1d6'),
      dark: makeRoll('1d6'),
    },
  },
})

export const getArmorStatRolls = (
  type: ArmorTypeT,
  rarity: ItemRarityT,
  requirementScore: number,
): ItemModifierValuesT => {
  const keys = shuffleArray(ArmorRarityStatKeys[rarity][type])
  let counts = ArmorRarityStatCounts[rarity]
  return getItemStatRolls(keys, counts, requirementScore)
}
