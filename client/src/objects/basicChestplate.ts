import { ArmorT } from '../types/Armor'
import { makeStaticRoll } from '../types/Roll'
import { BASE_EQUIPPABLE } from './util'

export const BASIC_CHESTPLATE: ArmorT = {
  ...BASE_EQUIPPABLE('armor'),
  id: 'basic-chestplate',
  equippable: true,
  type: 'armor',
  armorType: 'chest',
  rarity: 'rare',
  name: 'Basic Chestplate',
  cost: 1,
  resource: 'bodies',
  requirementCheck: {
    roll: 1,
    keys: ['strength'],
    value: 0,
  },
  traits: [
    {
      id: 'basic-chstplate--bonus',
      name: 'Bonus',
      abilitiesModifiers: {
        strength: 1,
        dexterity: 0,
        intelligence: 0,
        vigor: 1,
      },
      statsModifiers: {
        health: 0,
        focus: 0,
        will: 0,
        perception: 0,
        lift: 0,
        agility: 0,
        speed: -1,
      },
    },
  ],
  damageResistances: {
    slashing: makeStaticRoll(1),
    crushing: makeStaticRoll(3),
    fire: makeStaticRoll(0),
    blood: makeStaticRoll(0),
    light: makeStaticRoll(0),
    dark: makeStaticRoll(0),
  },
}
