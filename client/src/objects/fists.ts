import { WeaponT } from '../types/Weapon'
import { v4 } from 'uuid'
import { BASE_EQUIPPABLE, makeRequirementCheck } from './util'
import { makeCharacterCheck, makeCharacterRoll } from '../types/Roll2'

export const FISTS: WeaponT = {
  ...BASE_EQUIPPABLE('weapon'),
  id: v4(),
  equippable: true,
  type: 'weapon',
  weaponType: 'fists',
  name: 'Unarmed',
  cost: 0,
  resource: 'weaponHands',
  requirementCheck: makeRequirementCheck(['strength'], 1),
  damageRolls: {
    piercing: makeCharacterRoll([], '1d6', -3),
  },
  accuracyCheck: makeCharacterCheck(['dexterity']),
  traits: [],
  events: {},
}
