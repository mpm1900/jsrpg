import { v4 } from 'uuid'
import { OffhandTypeT, OffhandItemT } from '../../../types/Offhand'
import { makeStandardCharacterCheck } from '../../../types/Roll2'
import { ItemRarityT } from '../../../types/Item'

export const makeOffhand = (
  type: OffhandTypeT,
  rarity: ItemRarityT,
): OffhandItemT => {
  return {
    id: v4(),
    equippable: true,
    name: '',
    type: 'offhand',
    rarity,
    cost: 1,
    offhandType: type,
    resource: 'weaponHands',
    requirementCheck: makeStandardCharacterCheck(['dexterity'], 3),
    traits: [],
    damageResistances: {},
  }
}
