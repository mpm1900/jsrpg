import { BASE_EQUIPPABLE, makeRequirementCheck } from '../../util'
import { DamageTypeRollsT } from '../../../types/Damage'
import { ItemRarityT } from '../../../types/Item'
import { ItemModifierValuesT } from '../makeItem'
import { ArmorT, ArmorTypeT } from '../../../types/Armor'
import { CharacterResourceKeyT } from '../../../types/Character'
import { getRandom } from '../../../util/getRandom'
import {
  ArmorRequirementKeys,
  ArmorNameKeys,
  ArmorCostsT,
  ArmorResourcesT,
  getArmorStatRolls,
  ArmorResistances,
} from './stats'
import { UNIQUE_ARMORS } from './uniques'
import { MYTHIC_ARMORS } from './mythics'
import { Rarity3d6Map } from '../util'
import { SET_ARMORS } from './sets'
import { CharacterCheckT, quickRoll } from '../../../types/Roll2'

export const buildArmor = (type: ArmorTypeT, rarity?: ItemRarityT): ArmorT => {
  rarity = rarity || Rarity3d6Map[quickRoll('3d6')]
  const requirementCheck = makeRequirementCheck(
    [getRandom(ArmorRequirementKeys[type])],
    10, //getRollValue('3d6'),
  )
  const unique = UNIQUE_ARMORS.find(
    (a) => a.armorType === type || a.requirementCheck === requirementCheck,
  )
  const mythic = MYTHIC_ARMORS.find(
    (a) => a.armorType === type || a.requirementCheck === requirementCheck,
  )
  const set = SET_ARMORS.find(
    (a) => a.armorType === type || a.requirementCheck === requirementCheck,
  )
  if (rarity === 'unique' && unique) return unique
  if (rarity === 'mythic' && mythic) return mythic
  if (rarity === 'set' && set) return set
  return createArmor(
    type,
    ArmorNameKeys()[rarity][type],
    ArmorCostsT[type],
    ArmorResourcesT[type],
    requirementCheck,
    getArmorStatRolls(type, rarity, requirementCheck.value),
    ArmorResistances()[rarity][type],
    rarity,
  )
}

export const createArmor = (
  armorType: ArmorTypeT,
  name: string,
  cost: number,
  resource: CharacterResourceKeyT,
  requirementCheck: CharacterCheckT,
  statRolls: ItemModifierValuesT,
  damageRolls: DamageTypeRollsT,
  rarity: ItemRarityT,
): ArmorT => {
  const base = BASE_EQUIPPABLE('armor')
  return {
    ...base,
    type: 'armor',
    armorType,
    name,
    cost,
    resource,
    requirementCheck,
    rarity,
    damageResistances: {
      ...base.damageResistances,
      ...damageRolls,
    },
    traits: [
      {
        id: `${base.id}--bonus`,
        name: 'Armor Trait',
        duration: -1,
        healthOffset: 0,
        focusOffset: 0,
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
  }
}
