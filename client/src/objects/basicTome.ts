import { makeStaticRoll } from '../types/Roll'
import { EquippableT } from '../types/Item'
import { BASE_EQUIPPABLE, makeTrait } from './util'

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
      ...makeTrait(),
      id: 'basic-tome--bonus',
      abilitiesModifiers: {
        strength: 0,
        dexterity: 0,
        intelligence: 4,
        vigor: 0,
      },
    },
  ],
  damageResistances: {
    slashing: makeStaticRoll(0),
    piercing: makeStaticRoll(0),
    fire: makeStaticRoll(0),
    blood: makeStaticRoll(0),
    light: makeStaticRoll(0),
    dark: makeStaticRoll(0),
  },
}
