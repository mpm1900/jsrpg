import { ArmorT } from '../types/Armor'
import { makeStaticRoll } from '../types/Roll'
import { BASE_EQUIPPABLE } from './util'

export const BASIC_BOOTS: ArmorT = {
  ...BASE_EQUIPPABLE('armor'),
  id: 'basic-boots',
  equippable: true,
  type: 'armor',
  armorType: 'boots',
  rarity: 'unique',
  name: 'Basic Boots',
  cost: 2,
  resource: 'feet',
  requirementCheck: {
    roll: 8,
    keys: ['dexterity'],
    value: 0,
  },
  traits: [
    {
      id: 'basic-robe--bonus',
      name: 'Bonus',
      abilitiesModifiers: {
        strength: 0,
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
        agility: 1,
        speed: 1,
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
