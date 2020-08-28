import { EquippableT } from '../types/Item'
import { BASE_EQUIPPABLE, makeTrait, makeRequirementCheck } from './util'
import { makeCharacterRoll } from '../types/Roll2'

export const BASIC_TOME: EquippableT = {
  ...BASE_EQUIPPABLE('tome'),
  id: 'basic-tome',
  equippable: true,
  type: 'tome',
  rarity: 'unique',
  name: 'Basic Tome',
  cost: 1,
  resource: 'weaponHands',
  requirementCheck: makeRequirementCheck(['intelligence'], 12),
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
    slashing: makeCharacterRoll([]),
    piercing: makeCharacterRoll([]),
    fire: makeCharacterRoll([]),
    blood: makeCharacterRoll([]),
    light: makeCharacterRoll([]),
    dark: makeCharacterRoll([]),
  },
}
