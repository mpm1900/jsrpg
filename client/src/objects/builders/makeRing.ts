import { ArmorT } from '../../types/Armor'
import { makeStaticRoll, basicRoll } from '../../types/Roll'
import { BASE_EQUIPPABLE } from './../util'
import { ItemRarityT } from '../../types/Item'

const rarities: ItemRarityT[] = [
  'common',
  'uncommon',
  'rare',
  'legendary',
  'unique',
  'mythic',
  'mythic',
]

export const makeRing = (): ArmorT => {
  const base = BASE_EQUIPPABLE('armor')
  const strRoll = basicRoll({ roll: '1d4-3' }).total
  const dexRoll = basicRoll({ roll: '1d4-3' }).total
  const intRoll = basicRoll({ roll: '1d4-3' }).total
  const vigRoll = basicRoll({ roll: '1d4-3' }).total
  const wilRoll = basicRoll({ roll: '1d4-3' }).total
  const perRoll = basicRoll({ roll: '1d4-3' }).total
  const spdRoll = basicRoll({ roll: '1d4-3' }).total
  let hpRoll = 0
  const total =
    strRoll + dexRoll + intRoll + vigRoll + wilRoll + perRoll + spdRoll
  if (total === 0) hpRoll = 1
  return {
    ...base,
    type: 'armor',
    armorType: 'ring',
    rarity: rarities[total - 1] || 'common',
    name: 'Basic Ring',
    cost: 1,
    resource: 'fingers',
    requirementCheck: {
      roll: 4,
      keys: ['intelligence'],
      value: 0,
    },
    traits: [
      {
        id: `${base.id}--bonus`,
        name: 'Bonus',
        abilitiesModifiers: {
          strength: strRoll,
          dexterity: dexRoll,
          intelligence: intRoll,
          vigor: vigRoll,
        },
        statsModifiers: {
          health: hpRoll,
          focus: 0,
          will: wilRoll,
          perception: perRoll,
          lift: 0,
          agility: 0,
          speed: spdRoll,
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
}
