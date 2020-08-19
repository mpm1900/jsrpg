import { makeStaticRoll } from '../types/Roll'
import { EquippableT } from '../types/Item'
import { BASE_EQUIPPABLE } from './util'

export const BASIC_TOME: EquippableT = {
  ...BASE_EQUIPPABLE('tome'),
  id: 'basic-tome',
  equippable: true,
  type: 'tome',
  rarity: 'unique',
  name: 'Basic Tome',
  cost: 1,
  resource: 'weaponHands',
  requirementCheck: {
    roll: 12,
    keys: ['intelligence'],
    value: 0,
  },
  traits: [
    {
      id: 'basic-tome--bonus',
      name: 'Bonus',
      abilitiesModifiers: {
        strength: 0,
        dexterity: 0,
        intelligence: 4,
        vigor: 0,
      },
      statsModifiers: {
        health: 0,
        focus: 0,
        will: 0,
        perception: 0,
        lift: 0,
        agility: 0,
        speed: 0,
      },
    },
  ],
  damageResistances: {
    slashing: makeStaticRoll(0),
    crushing: makeStaticRoll(0),
    fire: makeStaticRoll(0),
    blood: makeStaticRoll(0),
    light: makeStaticRoll(0),
    dark: makeStaticRoll(0),
  },
}
