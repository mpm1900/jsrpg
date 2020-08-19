import { WeaponT } from '../types/Weapon'
import { BASE_EQUIPPABLE } from './util'

export const GREAT_SWORD: WeaponT = {
  ...BASE_EQUIPPABLE('weapon'),
  id: 'weapon-1',
  equippable: true,
  type: 'weapon',
  weaponType: 'greatsword',
  rarity: 'legendary',
  name: 'Greatsword',
  cost: 2,
  resource: 'weaponHands',
  requirementCheck: {
    roll: 14,
    keys: ['strength'],
    value: 0,
  },
  damageRolls: {
    slashing: {
      roll: '1d6',
      keys: ['strength'],
      value: -2,
    },
    crushing: undefined,
    fire: undefined,
    blood: undefined,
    light: undefined,
    dark: undefined,
  },
  accuracyCheck: {
    keys: ['dexterity'],
    value: -1,
  },
  traits: [
    {
      id: 'weapon-1--str-bonus',
      name: 'STR Bonus',
      abilitiesModifiers: {
        strength: 2,
        dexterity: 0,
        intelligence: 0,
        vigor: 1,
      },
      statsModifiers: {
        health: 5,
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
