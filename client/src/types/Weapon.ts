import { EquippableT } from './Item'
import { RollCheckT } from './Roll'
import { DamageTypeRollsT } from './Damage'

export type WeaponTypeT =
  // default
  | 'fists'
  // S
  | 'axe' // s,1
  | 'greataxe' // s,2
  | 'flail' // p,1
  // D
  | 'daggers' // p,2
  | 'katana' // s,1
  | 'rapier' // p,1
  // I
  | 'wand' // e,1
  | 'staff' // e,2
  // S+I
  | 'elementalSword' // s,e,1
  | 'elementalGreatsword' // s,e,2
  // S+D
  | 'sword' // s,1
  | 'greatsword' // s,2
  // D+I
  | 'pistol' // p,e,1
  | 'crossbow' // p,e,2

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
