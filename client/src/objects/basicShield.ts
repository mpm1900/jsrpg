import { makeStaticRoll } from '../types/Roll'
import { EquippableT } from '../types/Item'
import { BASE_EQUIPPABLE, makeTrait } from './util'

export const BASIC_SHIELD: EquippableT = {
  ...BASE_EQUIPPABLE('shield'),
  id: 'basic-shield',
  equippable: true,
  type: 'shield',
  rarity: 'rare',
  name: 'Basic Shield',
  cost: 1,
  resource: 'weaponHands',
  requirementCheck: {
    roll: 3,
    keys: ['strength'],
    value: 0,
  },
  traits: [
    {
      ...makeTrait(),
      id: 'basic-shield--bonus',
      abilitiesModifiers: {
        strength: 1,
        dexterity: 0,
        intelligence: 0,
        vigor: 2,
      },
      statsModifiers: {
        health: 0,
        focus: 0,
        will: 0,
        perception: 0,
        lift: 0,
        agility: -2,
      },
    },
  ],
  damageResistances: {
    slashing: makeStaticRoll(3),
    piercing: makeStaticRoll(2),
    fire: makeStaticRoll(0),
    blood: makeStaticRoll(0),
    light: makeStaticRoll(0),
    dark: makeStaticRoll(0),
  },
}
