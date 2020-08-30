import { EquippableT, ItemRarityT } from './Item'
import {
  DamageTypeRollsT,
  ZERO_DAMAGE_ROLLS,
  combineDamageTypeRolls,
} from './Damage'
import { CharacterT, ProcessedCharacterT, CharacterTraitT } from './Character'
import { CharacterCheckT, makeCharacterRoll } from './Roll2'
import { EventsT, combineEvents } from './Events'
import { reduce } from '../util/reduce'

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
  accuracyCheck: CharacterCheckT
  damageRolls: DamageTypeRollsT
  events: EventsT
  slotCount: number
  slots: WeaponModT[]
}
export interface ProcessedWeaponT extends WeaponT {
  processed: true
}

export interface WeaponTraitT {
  id: string
  accuracyOffset: number
  damageRolls: DamageTypeRollsT
  events: EventsT
  traits: CharacterTraitT[]
}
export const ZERO_WEAPON_TRAIT: WeaponTraitT = {
  id: '',
  accuracyOffset: 0,
  damageRolls: ZERO_DAMAGE_ROLLS,
  events: {},
  traits: [],
}
export interface WeaponModT {
  id: string
  name: string
  icon?: string
  rarity: ItemRarityT
  traits: WeaponTraitT[]
}

export const combineWeaponTraits = (
  ...traits: WeaponTraitT[]
): WeaponTraitT => {
  return traits.reduce((p, c) => {
    return {
      id: c.id,
      accuracyOffset: p.accuracyOffset + c.accuracyOffset,
      damageRolls: combineDamageTypeRolls(p.damageRolls, c.damageRolls),
      events: combineEvents(p.events, c.events),
      traits: [...p.traits, ...c.traits],
    }
  }, ZERO_WEAPON_TRAIT)
}

export const processWeapon = (weapon: WeaponT): ProcessedWeaponT => {
  if ((weapon as ProcessedWeaponT).processed) {
    throw new Error('No Processed Weapons Allowed')
  }
  const mods = weapon.slots
  const traits = reduce<WeaponModT, WeaponTraitT[]>(
    mods,
    (p, c) => [...p, ...c.traits],
    [],
  )
  const combinedTrait = combineWeaponTraits(...traits)
  const ret: ProcessedWeaponT = {
    ...weapon,
    processed: true,
    accuracyCheck: {
      ...weapon.accuracyCheck,
      value: weapon.accuracyCheck.value + combinedTrait.accuracyOffset,
    },
    damageRolls: combineDamageTypeRolls(
      weapon.damageRolls,
      combinedTrait.damageRolls,
    ),
    traits: [...weapon.traits, ...combinedTrait.traits],
    events: combineEvents(weapon.events, combinedTrait.events),
  }
  console.log('weapon', weapon.name)
  console.log(ret)
  return ret
}
