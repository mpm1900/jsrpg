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

export const makePistol = (): WeaponT => {
  const fireRoll = basicRoll({ roll: '5d6' }).total
  const intRoll = basicRoll({ roll: '1d4-2' }, true).total
  const dexRoll = basicRoll({ roll: '1d4-2' }, true).total
  const focRoll = basicRoll({ roll: '1d4-2' }, true).total
  const total = intRoll + dexRoll + focRoll
  const base = BASE_EQUIPPABLE('weapon')
  return {
    ...base,
    type: 'weapon',
    name: `Pistol`,
    rarity: getRarity[total] || 'common',
    weaponType: 'pistol',
    accuracyCheck: {
      keys: ['dexterity'],
      value: -6,
    },
    damageRolls: {
      slashing: undefined,
      crushing: undefined,
      fire: {
        roll: '1d6',
        keys: ['intelligence', 'dexterity'],
        value: fireRoll * -1,
      },
      blood: undefined,
      dark: undefined,
      light: undefined,
    },
    traits: [
      {
        id: `${base.id}--bonus`,
        name: 'Bonus',
        abilitiesModifiers: {
          strength: 0,
          dexterity: dexRoll,
          intelligence: intRoll,
          vigor: 0,
        },
        statsModifiers: {
          health: 0,
          focus: focRoll,
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
