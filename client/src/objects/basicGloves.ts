import { ArmorT } from '../types/Armor'
import { makeStaticRoll } from '../types/Roll'
import { BASE_EQUIPPABLE } from './util'

export const BASIC_GLOVES: ArmorT = {
  ...BASE_EQUIPPABLE('armor'),
  id: 'basic-gloves',
  equippable: true,
  type: 'armor',
  armorType: 'gloves',
  rarity: 'uncommon',
  name: 'Basic Gloves',
  cost: 2,
  resource: 'hands',
  requirementCheck: {
    roll: 4,
    keys: ['dexterity'],
    value: 0,
  },
  traits: [
    {
      id: 'basic-gloves--bonus',
      name: 'Bonus',
      abilitiesModifiers: {
        strength: 1,
        dexterity: 0,
        intelligence: 0,
        vigor: 0,
      },
      statsModifiers: {
        health: 0,
        focus: 0,
        will: 0,
        perception: 0,
        lift: 1,
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
