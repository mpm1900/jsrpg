import { WeaponT } from '../../../../types/Weapon'
import { buildWeapon } from '../createWeapon'
import { makeRoll, getRollValue } from '../../makeItem'
import { makeTrait } from '../../../util'

export const SWORD_OF_BLOOD_AND_FIRE: WeaponT = {
  ...buildWeapon('elementalSword', 'mythic'),
  name: 'Sword of Blood and Fire',
  damageRolls: {
    // getRollValue('2d6')
    slashing: makeRoll('1d10', -3, ['strength']),
    fire: makeRoll('1d4', -10, ['intelligence']),
    blood: makeRoll('1d4', -10, ['intelligence']),
  },
  events: {
    onHit: [
      {
        ...makeTrait(),
        name: 'heal on hit',
        healthOffset: 5,
      },
    ],
    onCrit: [
      {
        ...makeTrait(),
        name: 'add strenth on crit',
        abilitiesModifiers: {
          strength: 2,
          dexterity: 0,
          intelligence: 0,
          vigor: 0,
        },
      },
    ],
  },
}

export const SWORD_OF_THE_INFINITE: WeaponT = {
  ...buildWeapon('elementalSword', 'mythic'),
  name: 'Sword of the Infinite',
  damageRolls: {
    // getRollValue('2d6')
    fire: makeRoll('1d6'),
    blood: makeRoll('1d6'),
    light: makeRoll('1d6'),
    dark: makeRoll('1d6'),
  },
  events: {
    onHit: [
      {
        ...makeTrait(),
        name: 'heal on hit',
        healthOffset: 5,
      },
    ],
    onCrit: [
      {
        ...makeTrait(),
        name: 'add strenth on crit',
        abilitiesModifiers: {
          strength: 2,
          dexterity: 0,
          intelligence: 0,
          vigor: 0,
        },
      },
    ],
  },
}

export const MYTHIC_WEAPONS: WeaponT[] = []
