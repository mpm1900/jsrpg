import React from 'react'
import { useCharacterContext } from '../../contexts/CharacterContext'
import { ONE_COMPARE } from '../../util/compare'
import { DamageTypeKeyT } from '../../types/Damage'
import {
  CharacterSkillCheckKeyT,
  combineTraits,
  getTraitValue,
} from '../../types/Character'
import {
  CompareContextProvider,
  useCompareContext,
} from '../../contexts/CompareContext'
import { EquippableT } from '../../types/Item'
import { BASE_EQUIPPABLE } from '../../objects/util'
import { ItemPreview } from '../ItemPreview'
import { ArmorT } from '../../types/Armor'
import { CharacterRollT } from '../../types/Roll2'

export interface EquipedItemComparePropsT {
  item: EquippableT
}
export const EquipeItemCompare = (props: EquipedItemComparePropsT) => {
  const { item } = props
  const { character } = useCharacterContext()
  if ((item as ArmorT).armorType === 'ring')
    return (
      <ItemPreview
        item={item}
        showEquipButton={false}
        showRequirementCheck={true}
        showCollapseButton={false}
      />
    )
  const testItem = [...character.armor, ...character.equippedItems].find(
    (i) => {
      if (item.type === 'armor') {
        return i.type === 'armor' && i.resource === item.resource
      } else {
        return i.type !== 'armor' && i.resource === item.resource
      }
    },
  )
  return (
    <CompareContextProvider<EquippableT>
      a={item}
      b={testItem || BASE_EQUIPPABLE('armor')}
    >
      <ItemCompareItem />
    </CompareContextProvider>
  )
}

export interface ItemCompareItemPropsT {}
export const ItemCompareItem = (props: ItemCompareItemPropsT) => {
  const context = useCompareContext<EquippableT>()
  const { compareChecks, compareRolls, compareValues } = context
  const a: EquippableT = context['a'] || BASE_EQUIPPABLE('armor')
  const b: EquippableT = context['b'] || BASE_EQUIPPABLE('armor')

  const requirementCompare = compareChecks(
    a.requirementCheck,
    b.requirementCheck,
  )
  const resistancesCompare = (key: DamageTypeKeyT) => {
    const itemRoll = a.damageResistances[key] as CharacterRollT
    const testRoll = b.damageResistances[key] as CharacterRollT
    if (!testRoll) return ONE_COMPARE
    return compareRolls(itemRoll, testRoll)
  }
  const traitCompare = (key: CharacterSkillCheckKeyT) => {
    const itemValue = getTraitValue(combineTraits(a.traits), key)
    const testValue = getTraitValue(combineTraits(b.traits), key)
    return compareValues(itemValue, testValue)
  }
  const costComapre = compareValues(b.cost, a.cost)

  return (
    <ItemPreview
      item={a}
      showEquipButton={false}
      requirementCompare={requirementCompare}
      resistancesCompare={resistancesCompare}
      traitCompare={traitCompare}
      costComare={costComapre}
    />
  )
}
