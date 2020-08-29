import { BASE_EQUIPPABLE, makeRequirementCheck, makeTrait } from '../../util'
import { WeaponT, WeaponTypeT } from '../../../types/Weapon'
import { DamageTypeRollsT } from '../../../types/Damage'
import { ItemRarityT } from '../../../types/Item'
import { ItemModifierValuesT } from '../makeItem'
import { Rarity3d6Map } from '../util'
import { getRandom } from '../../../util/getRandom'
import {
  WeaponRequirementKeys,
  WeaponCosts,
  getWeaponStatRolls,
  WeaponNameKeys,
  WeaponDamages,
} from './stats'
import {
  CharacterCheckT,
  makeCharacterCheck,
  quickRoll,
} from '../../../types/Roll2'

export const buildWeapon = (
  type: WeaponTypeT,
  rarity?: ItemRarityT,
): WeaponT => {
  rarity = rarity || Rarity3d6Map[quickRoll('3d6')]
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
    0,
    getWeaponStatRolls(type, rarity, requirementCheck.value),
    WeaponDamages()[rarity][type],
    rarity,
  )
}

export const createWeapon = (
  weaponType: WeaponTypeT,
  name: string,
  cost: number,
  requirementCheck: CharacterCheckT,
  accuracyModifier: number,
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
    accuracyCheck: makeCharacterCheck(
      ['accuracy'],
      undefined,
      0,
      accuracyModifier,
    ),
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
          agility: statRolls.agility || 0,
          accuracy: statRolls.accuracy || 0,
          evade: statRolls.evade || 0,
        },
      },
    ],
    events: {},
    ...rest,
  }
}
