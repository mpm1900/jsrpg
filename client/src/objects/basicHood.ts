import { ArmorT } from '../types/Armor'
import { makeStaticRoll } from '../types/Roll'
import { BASE_EQUIPPABLE } from './util'

export const BASIC_COWL: ArmorT = {
  ...BASE_EQUIPPABLE('armor'),
  id: 'basic-cowl',
  equippable: true,
  type: 'armor',
  armorType: 'cowl',
  rarity: 'legendary',
  name: 'Basic Hood',
  cost: 1,
  resource: 'heads',
  requirementCheck: {
    roll: 3,
    keys: ['dexterity'],
    value: 0,
  },
  traits: [
    {
      id: 'basic-cowl--bonus',
      name: 'Bonus',
      abilitiesModifiers: {
        strength: 0,
        dexterity: 1,
        intelligence: 1,
        vigor: 0,
      },
      statsModifiers: {
        health: 0,
        focus: 0,
        will: 0,
        perception: 3,
        lift: 0,
        agility: 0,
        speed: 0,
      },
    },
  ],
  damageResistances: {
    slashing: makeStaticRoll(0),
    crushing: makeStaticRoll(0),
    fire: makeStaticRoll(-10),
    blood: makeStaticRoll(-2, '1d6'),
    light: makeStaticRoll(2),
    dark: makeStaticRoll(-2, '1d4'),
  },
}
