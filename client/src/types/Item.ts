import { CharacterTraitT, CharacterResourceKeyT } from './Character'
import { DamageTypeRollsT } from './Damage'
import { CharacterCheckT } from './Roll2'

export type ItemRarityT =
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'legendary'
  | 'unique'
  | 'mythic'
  | 'set'
export interface ItemT {
  id: string
  name: string
  rarity: ItemRarityT
  icon?: string
}
export type ItemTypeT = 'weapon' | 'armor' | 'offhand'
export interface EquippableT extends ItemT {
  equippable: true
  type: ItemTypeT
  cost: number
  resource: CharacterResourceKeyT
  requirementCheck: CharacterCheckT
  traits: CharacterTraitT[]
  damageResistances: DamageTypeRollsT
}

export const ItemRarityColorMap: Record<ItemRarityT, string> = {
  common: '#fff',
  uncommon: '#9fbd9f',
  rare: '#91b4f2',
  legendary: '#cda5f3',
  unique: '#c2af6b',
  mythic: 'lightsalmon',
  set: '#38f5e2',
}
