import { RollCheckT } from './Roll'
import { CharacterTraitT, CharacterResourceKeyT } from './Character'
import { DamageTypeRollsT } from './Damage'

export type ItemRarityT =
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'legendary'
  | 'unique'
  | 'mythic'
export interface ItemT {
  id: string
  name: string
  rarity: ItemRarityT
  icon?: string
}
export type ItemTypeT = 'weapon' | 'armor' | 'shield' | 'tome'
export interface EquippableT extends ItemT {
  equippable: true
  type: ItemTypeT
  rarity: ItemRarityT
  cost: number
  resource: CharacterResourceKeyT
  requirementCheck: RollCheckT
  traits: CharacterTraitT[]
  damageResistances: DamageTypeRollsT
}

export const ItemRarityColorMap: Record<ItemRarityT, string> = {
  common: '#ddd',
  uncommon: '#a1cea1',
  rare: '#91b4f2',
  legendary: '#cda5f3',
  unique: '#d6c48a',
  mythic: 'lightsalmon',
}
