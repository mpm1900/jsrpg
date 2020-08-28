import { EquippableT } from '../types/Item'
import { BASE_EQUIPPABLE, makeTrait, makeRequirementCheck } from './util'
import { makeCharacterRoll } from '../types/Roll2'

export const BASIC_SHIELD: EquippableT = {
  ...BASE_EQUIPPABLE('shield'),
  id: 'basic-shield',
  equippable: true,
  type: 'shield',
  rarity: 'rare',
  name: 'Basic Shield',
  cost: 1,
  resource: 'weaponHands',
  requirementCheck: makeRequirementCheck(['strength'], 3),
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
    slashing: makeCharacterRoll([], undefined, 3),
    piercing: makeCharacterRoll([], undefined, 2),
    fire: makeCharacterRoll([]),
    blood: makeCharacterRoll([]),
    light: makeCharacterRoll([]),
    dark: makeCharacterRoll([]),
  },
}
