import { WeaponT } from '../types/Weapon'
import { BASE_EQUIPPABLE } from './util'

export const LONG_SWORD: WeaponT = {
  ...BASE_EQUIPPABLE('weapon'),
  id: 'weapon-0',
  equippable: true,
  type: 'weapon',
  weaponType: 'longsword',
  name: 'Longsword',
  cost: 1,
  resource: 'weaponHands',
  requirementCheck: {
    roll: 8,
    keys: ['strength'],
    value: 0,
  },
  damageRolls: {
    slashing: {
      roll: '1d6',
      keys: ['perception'],
      value: -8,
    },
    crushing: undefined,
    fire: undefined,
    blood: undefined,
    light: undefined,
    dark: undefined,
  },
  accuracyCheck: {
    keys: ['dexterity'],
    value: 0,
  },
  traits: [
    {
      id: 'weapon-0--str-bonus',
      name: 'STR Bonus',
      abilitiesModifiers: {
        strength: 1,
        dexterity: 0,
        intelligence: 0,
        vigor: 2,
      },
      statsModifiers: {
        health: 4,
        focus: 0,
        will: 0,
        perception: 0,
        lift: 0,
        agility: 0,
        speed: 0,
      },
    },
  ],
}
