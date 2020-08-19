import { ArmorT } from '../types/Armor'
import { makeStaticRoll } from '../types/Roll'
import { BASE_EQUIPPABLE } from './util'

export const BASIC_RING: ArmorT = {
  ...BASE_EQUIPPABLE('armor'),
  id: 'basic-ring',
  equippable: true,
  type: 'armor',
  armorType: 'ring',
  rarity: 'mythic',
  name: 'Basic Ring',
  cost: 1,
  resource: 'fingers',
  requirementCheck: {
    roll: 4,
    keys: ['intelligence'],
    value: 0,
  },
  traits: [
    {
      id: 'basic-ring--bonus',
      name: 'Bonus',
      abilitiesModifiers: {
        strength: 0,
        dexterity: 0,
        intelligence: 0,
        vigor: 0,
      },
      statsModifiers: {
        health: 0,
        focus: 1,
        will: 1,
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
