import { WeaponT, ZERO_WEAPON_TRAIT } from '../../../../types/Weapon'
import { buildWeapon } from '../createWeapon'
import { makeTrait } from '../../../util'
import { makeCharacterRoll } from '../../../../types/Roll2'
import { v4 } from 'uuid'

export const SWORD_OF_BLOOD_AND_FIRE: WeaponT = {
  ...buildWeapon('elementalSword', 'mythic'),
  name: 'Sword of Blood and Fire',
  damageRolls: {
    // getRollValue('2d6')
    slashing: makeCharacterRoll(['strength'], '1d10', -3),
    fire: makeCharacterRoll(['intelligence'], '1d4', -10),
    blood: makeCharacterRoll(['intelligence'], '1d4', -10),
  },
  events: {
    onHit: [
      {
        ...makeTrait(),
        name: 'heal on hit',
        healthOffset: 5,
      },
      {
        ...makeTrait(),
        name: 'restore fp on hit',
        focusOffset: 5,
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
    fire: makeCharacterRoll([], '3d6', -3),
    blood: makeCharacterRoll([], '', 6),
    light: makeCharacterRoll(['intelligence'], '', -7),
    dark: makeCharacterRoll(['intelligence'], '1d6', -10),
    slashing: makeCharacterRoll([]),
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
  slotCount: 3,
  slots: [
    {
      id: v4(),
      name: 'Slash Gem',
      rarity: 'mythic',
      traits: [
        {
          ...ZERO_WEAPON_TRAIT,
          accuracyOffset: 2,
          traits: [
            {
              ...makeTrait(),
              statsModifiers: {
                health: 0,
                focus: 2,
                will: 0,
                perception: 0,
                accuracy: 0,
                agility: 0,
                evade: 2,
              },
            },
          ],
          damageRolls: {
            slashing: makeCharacterRoll([], '1d6'),
          },
        },
      ],
    },
  ],
}

export const MYTHIC_WEAPONS: WeaponT[] = []
