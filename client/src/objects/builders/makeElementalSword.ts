import { BASE_EQUIPPABLE } from '../util'
import { WeaponT } from '../../types/Weapon'
import { makeStaticRoll, basicRoll } from '../../types/Roll'

export const makeElementalSword = (
  type: 'fire' | 'blood' | 'light' | 'dark',
): WeaponT => {
  const slashRoll = basicRoll({ roll: '3d6' }).total
  const intRoll = basicRoll({ roll: '1d4-1' }).total
  const strRoll = basicRoll({ roll: '1d4-1' }).total
  const base = BASE_EQUIPPABLE('weapon')
  return {
    ...base,
    type: 'weapon',
    name: `${type.charAt(0).toUpperCase() + type.slice(1)} Sword`,
    icon: `${type}-sword` as string,
    rarity: 'mythic',
    cost: 1,
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
      [type]: {
        roll: '2d6',
        keys: ['intelligence'],
        value: -18,
      },
    },
    traits: [
      {
        id: `${base.id}--bonus`,
        name: 'Bonus',
        abilitiesModifiers: {
          strength: strRoll,
          dexterity: 0,
          intelligence: intRoll,
          vigor: 0,
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
