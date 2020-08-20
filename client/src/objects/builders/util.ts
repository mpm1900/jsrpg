import { ItemRarityT } from '../../types/Item'
import { CharacterSkillCheckKeyT } from '../../types/Character'
import { ItemModifierValuesT } from './makeItem'
import { getRandom } from '../../util/getRandom'

export const shuffleArray = <T>(a: T[]): T[] => {
  let array = [...a]
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export const Rarity3d6Map: Record<number, ItemRarityT> = {
  3: 'set',
  4: 'unique',
  5: 'legendary',
  6: 'rare',
  7: 'uncommon',
  8: 'common',
  9: 'common',
  10: 'common',
  11: 'common',
  12: 'common',
  13: 'uncommon',
  14: 'uncommon',
  15: 'rare',
  16: 'legendary',
  17: 'unique',
  18: 'mythic',
}

export const getItemStatRolls = (
  keys: CharacterSkillCheckKeyT[],
  count: number,
  requirementScore: number,
): ItemModifierValuesT => {
  let offset = requirementScore - 13
  offset = offset > 0 ? offset : 0

  let statCount = count + offset
  statCount = statCount > 0 ? statCount : 0

  let statRolls: ItemModifierValuesT = {}
  for (let i = 0; i < statCount; ++i) {
    let key = getRandom(shuffleArray(keys))
    statRolls[key] = (statRolls[key] || 0) + 1
  }
  return statRolls
}
