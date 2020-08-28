import { EquippableT, ItemTypeT, ItemRarityT } from '../../types/Item'
import { getRandom } from '../../util/getRandom'
import { WeaponTypeT, WeaponT } from '../../types/Weapon'
import { getKeys } from '../../util/getKeys'
import { ArmorT, ArmorTypeT } from '../../types/Armor'
import { BASIC_SHIELD } from '../basicShield'
import { FISTS } from '../fists'
import { BASIC_TOME } from '../basicTome'
import { CharacterSkillCheckKeyT } from '../../types/Character'

import { buildArmor } from './armor/createArmor'
import { buildWeapon } from './weapons/createWeapon'

type _ItemModifierValuesT = Record<CharacterSkillCheckKeyT, number>
export type ItemModifierValuesT = Partial<_ItemModifierValuesT>

export const getTotal = (rollResults: ItemModifierValuesT): number => {
  return getKeys(rollResults as _ItemModifierValuesT)
    .map((key) => rollResults[key] as number)
    .reduce((sum, current) => sum + current, 0)
}

const ITEM_TYPES: ItemTypeT[] = [
  'weapon',
  'weapon',
  'armor',
  'armor',
  'armor',
  'armor',
]
export type ItemMakerMapT = Record<ItemTypeT, () => EquippableT>
export const makeItem = (core: ItemMakerMapT): EquippableT => {
  return core[getRandom<ItemTypeT>(ITEM_TYPES)]()
}

export type WeaponMakerMapT = Partial<Record<WeaponTypeT, () => WeaponT>>
export const makeWeapon = (core: WeaponMakerMapT): WeaponT => {
  const keys = getKeys(core)
  const randomKey = getRandom<WeaponTypeT>(keys)
  const maker = core[randomKey] || (() => FISTS)
  return maker()
}

export type ArmorMakerMapT = Partial<Record<ArmorTypeT, () => ArmorT>>
export const makeArmor = (core: ArmorMakerMapT): ArmorT => {
  const keys = getKeys(core)
  const randomKey = getRandom<ArmorTypeT>(keys)
  const maker = core[randomKey] || (() => buildArmor('ring'))
  return maker()
}

const rarityArray: ItemRarityT[] = [
  'common',
  'uncommon',
  'rare',
  'legendary',
  'unique',
  'mythic',
]
export const getRarity = (index: number): ItemRarityT => {
  if (index < 0) return 'common'
  if (index >= rarityArray.length) return 'mythic'
  return rarityArray[index]
}

const itemCore: ItemMakerMapT = {
  weapon: () =>
    makeWeapon({
      // fists: () => FISTS,
      // S
      axe: () => buildWeapon('axe'),
      greataxe: () => buildWeapon('greataxe'),
      flail: () => buildWeapon('flail'),
      // D
      daggers: () => buildWeapon('daggers'),
      katana: () => buildWeapon('katana'),
      rapier: () => buildWeapon('rapier'),
      // I
      wand: () => buildWeapon('wand'),
      staff: () => buildWeapon('staff'),
      // S+I
      elementalSword: () => buildWeapon('elementalSword'),
      elementalGreatsword: () => buildWeapon('elementalGreatsword'),
      // S+D
      sword: () => buildWeapon('sword'),
      greatsword: () => buildWeapon('greatsword'),
      // D+I
      pistol: () => buildWeapon('pistol'),
      crossbow: () => buildWeapon('crossbow'),
    }),
  armor: () =>
    makeArmor({
      helmet: () => buildArmor('helmet'),
      cowl: () => buildArmor('cowl'),
      chestplate: () => buildArmor('chestplate'),
      robe: () => buildArmor('robe'),
      ring: () => buildArmor('ring'),
      boots: () => buildArmor('boots'),
      gloves: () => buildArmor('gloves'),
    }),
  shield: () => BASIC_SHIELD,
  tome: () => BASIC_TOME,
}

export default (): EquippableT => makeItem(itemCore)
