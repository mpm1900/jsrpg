import { BASE_EQUIPPABLE, makeRequirementCheck, makeTrait } from '../../util'
import { WeaponT, WeaponTypeT } from '../../../types/Weapon'
import { DamageTypeRollsT } from '../../../types/Damage'
import { ItemRarityT } from '../../../types/Item'
import { ItemModifierValuesT, getRollValue } from '../makeItem'
import { RollCheckT } from '../../../types/Roll'
import { Rarity3d6Map } from '../util'
import { getRandom } from '../../../util/getRandom'
import {
  WeaponRequirementKeys,
  WeaponCosts,
  getWeaponStatRolls,
  WeaponNameKeys,
  WeaponDamages,
} from './stats'

export const buildWeapon = (
  type: WeaponTypeT,
  rarity?: ItemRarityT,
): WeaponT => {
  rarity = rarity || Rarity3d6Map[getRollValue('3d6')]
  if (rarity === 'set') rarity = 'mythic'
  const requirementCheck = makeRequirementCheck(
    [getRandom(WeaponRequirementKeys[type])],
    10, //getRollValue('3d6'),
  )
  return createWeapon(
    type,
    WeaponNameKeys()[rarity][type],
    WeaponCosts[type],
    requirementCheck,
    -2,
    getWeaponStatRolls(type, rarity, requirementCheck.roll as number),
    WeaponDamages()[rarity][type],
    rarity,
  )
}

export const createWeapon = (
  weaponType: WeaponTypeT,
  name: string,
  cost: number,
  requirementCheck: RollCheckT,
  dexterityModifier: number,
  statRolls: ItemModifierValuesT,
  damageRolls: DamageTypeRollsT,
  rarity: ItemRarityT,
  rest: Partial<WeaponT> = {},
): WeaponT => {
  const base = BASE_EQUIPPABLE('weapon')
  return {
    ...base,
    type: 'weapon',
    weaponType,
    name,
    cost,
    rarity,
    requirementCheck,
    accuracyCheck: {
      keys: ['dexterity'],
      value: dexterityModifier,
    },
    damageRolls,
    traits: [
      {
        ...makeTrait(),
        id: `${base.id}--bonus`,
        name: 'Weapon Trait',
        abilitiesModifiers: {
          strength: statRolls.strength || 0,
          dexterity: statRolls.dexterity || 0,
          intelligence: statRolls.intelligence || 0,
          vigor: statRolls.vigor || 0,
        },
        statsModifiers: {
          health: statRolls.health || 0,
          focus: statRolls.focus || 0,
          will: statRolls.will || 0,
          perception: statRolls.perception || 0,
          lift: statRolls.lift || 0,
          agility: statRolls.agility || 0,
        },
      },
    ],
    events: {},
    ...rest,
  }
}
