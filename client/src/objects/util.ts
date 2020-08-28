import { EquippableT, ItemTypeT } from '../types/Item'
import { v4 } from 'uuid'
import { CharacterSkillCheckKeyT, CharacterTraitT } from '../types/Character'
import {
  CharacterCheckT,
  makeCharacterCheck,
  makeCharacterRoll,
} from '../types/Roll2'

export const makeRequirementCheck = (
  keys: CharacterSkillCheckKeyT[],
  value: number,
): CharacterCheckT => makeCharacterCheck(keys, '', value, undefined)

export const BASE_EQUIPPABLE = (type: ItemTypeT): EquippableT => {
  const id = v4()
  return {
    id,
    type,
    rarity: 'common',
    equippable: true,
    name: '',
    cost: 0,
    resource: 'weaponHands',
    requirementCheck: makeRequirementCheck(['intelligence'], 1),
    traits: [
      {
        id: `${id}-0`,
        name: 'Bonus',
        duration: -1,
        healthOffset: 0,
        focusOffset: 0,
        abilitiesModifiers: {
          strength: 0,
          dexterity: 0,
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
}

export const makeTrait = (name: string = ''): CharacterTraitT => {
  return {
    id: v4(),
    name,
    duration: -1,
    healthOffset: 0,
    focusOffset: 0,
    abilitiesModifiers: {
      strength: 0,
      dexterity: 0,
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
    },
  }
}
