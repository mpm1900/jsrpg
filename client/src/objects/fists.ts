import { WeaponT } from '../types/Weapon'
import { v4 } from 'uuid'
import { BASE_EQUIPPABLE } from './util'

export const FISTS: WeaponT = {
  ...BASE_EQUIPPABLE('weapon'),
  id: v4(),
  equippable: true,
  type: 'weapon',
  weaponType: 'fists',
  name: 'Unarmed',
  cost: 0,
  resource: 'weaponHands',
  requirementCheck: {
    roll: 1,
    keys: ['strength'],
    value: 0,
  },
  damageRolls: {
    slashing: undefined,
    piercing: {
      roll: '1d6',
      keys: [],
      value: -3,
    },
  },
  accuracyCheck: {
    keys: ['dexterity'],
    value: -1,
  },
  traits: [],
}
