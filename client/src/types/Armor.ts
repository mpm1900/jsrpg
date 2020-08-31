import { EquippableT } from './Item'

export type ArmorTypeT =
  | 'helmet'
  | 'cowl'
  | 'chestplate'
  | 'robe'
  | 'gloves'
  | 'ring'
  | 'boots'
export interface ArmorT extends EquippableT {
  type: 'armor'
  armorType: ArmorTypeT
}

export const ArmorTypeSortKey: Record<ArmorTypeT, number> = {
  helmet: 0,
  cowl: 0,
  chestplate: 1,
  robe: 1,
  gloves: 2,
  ring: 3,
  boots: 4,
}
