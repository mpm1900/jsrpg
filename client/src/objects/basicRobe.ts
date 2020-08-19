import { ArmorT } from '../types/Armor'
import { makeStaticRoll } from '../types/Roll'
import { BASE_EQUIPPABLE } from './util'

export const BASIC_ROBE: ArmorT = {
  ...BASE_EQUIPPABLE('armor'),
  id: 'basic-robe',
  equippable: true,
  type: 'armor',
  armorType: 'robe',
  rarity: 'rare',
  name: 'Basic Robe',
  cost: 1,
  resource: 'bodies',
  requirementCheck: {
    roll: 8,
    keys: ['intelligence'],
    value: 0,
  },
  traits: [
    {
      id: 'basic-robe--bonus',
      name: 'Bonus',
      abilitiesModifiers: {
        strength: 0,
        dexterity: 1,
        intelligence: 2,
        vigor: 0,
      },
      statsModifiers: {
        health: 0,
        focus: 0,
        will: 0,
        perception: 0,
        lift: 0,
        agility: 2,
        speed: 2,
      },
    },
  ],
  damageResistances: {
    slashing: makeStaticRoll(-1),
    crushing: makeStaticRoll(0),
    fire: makeStaticRoll(0),
    blood: makeStaticRoll(0),
    light: makeStaticRoll(3),
    dark: makeStaticRoll(4),
  },
}
