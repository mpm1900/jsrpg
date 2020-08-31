import { EquippableT } from './Item'

export type OffhandTypeT = 'shield' | 'tome' | 'banner' | 'knife'
export interface OffhandItemT extends EquippableT {
  type: 'offhand'
  offhandType: OffhandTypeT
  resource: 'weaponHands'
}
