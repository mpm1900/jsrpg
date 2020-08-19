import { EquippableT } from './Item'
import { RollCheckT } from './Roll'
import { DamageTypeRollsT } from './Damage'

export type WeaponTypeT = 'fists' | 'longsword' | 'greatsword' | 'pistol'
export type WeaponIconKeyT =
  | 'fire-sword'
  | 'blood-sword'
  | 'light-sword'
  | 'dark-sword'
export interface WeaponT extends EquippableT {
  type: 'weapon'
  weaponType: WeaponTypeT
  accuracyCheck: RollCheckT
  damageRolls: DamageTypeRollsT
}
