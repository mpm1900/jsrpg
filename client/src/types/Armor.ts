import { EquippableT } from './Item'
import { DamageTypeRollsT } from './Damage'

export type ArmorTypeT =
  | 'head'
  | 'cowl'
  | 'chest'
  | 'robe'
  | 'gloves'
  | 'ring'
  | 'boots'
export interface ArmorT extends EquippableT {
  type: 'armor'
  armorType: ArmorTypeT
  damageResistances: DamageTypeRollsT
}

export const ArmorTypeSortKey: Record<ArmorTypeT, number> = {
  head: 0,
  cowl: 0,
  chest: 1,
  robe: 1,
  gloves: 2,
  ring: 3,
  boots: 4,
}
