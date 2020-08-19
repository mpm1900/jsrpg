import { ArmorT } from '../types/Armor'
import { makeStaticRoll } from '../types/Roll'
import { BASE_EQUIPPABLE } from './util'

export const BASIC_HELMET: ArmorT = {
  ...BASE_EQUIPPABLE('armor'),
  id: 'basic-helmt',
  equippable: true,
  type: 'armor',
  armorType: 'head',
  rarity: 'uncommon',
  name: 'Basic Helmet',
  cost: 1,
  resource: 'heads',
  requirementCheck: {
    roll: 1,
    keys: ['strength'],
    value: 0,
  },
  traits: [
    {
      id: 'basic-helmet--bonus',
      name: 'Bonus',
      abilitiesModifiers: {
        strength: 3,
        dexterity: 1,
        intelligence: 0,
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
    slashing: makeStaticRoll(1),
    crushing: makeStaticRoll(2),
    fire: makeStaticRoll(3),
    blood: makeStaticRoll(0),
    light: makeStaticRoll(1),
    dark: makeStaticRoll(1),
  },
}
