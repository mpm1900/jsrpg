import React from 'react'
import { WeaponT } from '../../types/Weapon'
import { useCharacterContext } from '../../contexts/CharacterContext'
import { RollCheckT } from '../../types/Roll'
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
import { WeaponPreview } from '../WeaponPreview'
import { FISTS } from '../../objects/fists'

export interface EquipedWeaponComparePropsT {
  weapon: WeaponT
}
export const EquipedWeaponCompare = (props: EquipedWeaponComparePropsT) => {
  const { weapon } = props
  const { character } = useCharacterContext()
  return (
    <CompareContextProvider<WeaponT> a={weapon} b={character.weapon}>
      <WeaponCompareItem />
    </CompareContextProvider>
  )
}

export interface WeaponCompareItemPropsT {}
export const WeaponCompareItem = (props: WeaponCompareItemPropsT) => {
  const context = useCompareContext<WeaponT>()
  const { compareChecks, compareRolls, compareValues } = context
  const a: WeaponT = context['a'] || FISTS
  const b: WeaponT = context['b'] || FISTS

  const requirementCompare = compareChecks(
    a.requirementCheck,
    b.requirementCheck,
  )
  const accuracyCompare = compareChecks(a.accuracyCheck, b.accuracyCheck)
  const damageCompare = (key: DamageTypeKeyT) => {
    const weaponRoll = a.damageRolls[key] as RollCheckT
    const testRoll = b.damageRolls[key] as RollCheckT
    if (!testRoll) return ONE_COMPARE
    return compareRolls(weaponRoll, testRoll)
  }
  const traitCompare = (key: CharacterSkillCheckKeyT) => {
    const weaponValue = getTraitValue(combineTraits(a.traits), key)
    const testValue = getTraitValue(combineTraits(b.traits), key)
    return compareValues(weaponValue, testValue)
  }
  const costComapre = compareValues(b.cost, a.cost)

  return (
    <WeaponPreview
      weapon={a}
      showEquipButton={false}
      requirementCompare={requirementCompare}
      accuracyCompare={accuracyCompare}
      damageCompare={damageCompare}
      traitCompare={traitCompare}
      costComare={costComapre}
    />
  )
}
