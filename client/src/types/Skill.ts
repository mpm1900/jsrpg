import { CharacterCheckT } from './Roll2'
import { DamageTypeRollsT } from './Damage'
import { CharacterTraitT } from './Character'
import { EventsT } from './Events'

export interface SkillT {
  id: string
  name: string
  check?: CharacterCheckT
  requirementCheck: CharacterCheckT
  damageRolls: DamageTypeRollsT
  traits: CharacterTraitT[]
  events: EventsT
  combineWeaponDamage: boolean
  checkDodgeForTraits: boolean
  focusCost: number
  inspected?: true
}
