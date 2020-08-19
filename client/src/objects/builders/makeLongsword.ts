import { BASE_EQUIPPABLE } from '../util'
import { WeaponT } from '../../types/Weapon'
import { basicRoll } from '../../types/Roll'
import { ItemRarityT } from '../../types/Item'

const getRarity: ItemRarityT[] = [
  'common',
  'uncommon',
  'rare',
  'legendary',
  'unique',
  'mythic',
]

export const makeLongsword = (): WeaponT => {
  const slashRoll = basicRoll({ roll: '3d6' }).total
  const strRoll = basicRoll({ roll: '1d4-2' }, true).total
  const dexRoll = basicRoll({ roll: '1d4-2' }, true).total
  const vigRoll = basicRoll({ roll: '1d4-2' }, true).total
  const total = strRoll + dexRoll + vigRoll
  const base = BASE_EQUIPPABLE('weapon')
  return {
    ...base,
    type: 'weapon',
    name: `Long Sword`,
    rarity: getRarity[total] || 'common',
    weaponType: 'longsword',
    accuracyCheck: {
      keys: ['dexterity'],
      value: -2,
    },
    damageRolls: {
      slashing: {
        roll: '1d6',
        keys: ['strength'],
        value: slashRoll * -1,
      },
      crushing: undefined,
      fire: undefined,
      blood: undefined,
      dark: undefined,
      light: undefined,
    },
    traits: [
      {
        id: `${base.id}--bonus`,
        name: 'Bonus',
        abilitiesModifiers: {
          strength: strRoll,
          dexterity: dexRoll,
          intelligence: 0,
          vigor: vigRoll,
        },
        statsModifiers: {
          health: 0,
          focus: 0,
          will: 0,
          perception: 0,
          lift: 0,
          agility: 0,
          speed: 0,
        },
      },
    ],
  }
}
