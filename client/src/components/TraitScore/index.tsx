import React from 'react'
import {
  CharacterTraitT,
  CharacterKeyMap3,
  CharacterSkillCheckKeyT,
  getTraitValue,
} from '../../types/Character'
import { getSign } from '../../util/getSign'
import { getKeys } from '../../util/getKeys'
import { CompareResultFn, ZERO_COMPARE, BASE_ARGS } from '../../util/compare'

export interface TraitScorePropsT {
  trait: CharacterTraitT
  compareResult?: (keY: CharacterSkillCheckKeyT) => CompareResultFn
}
export const TraitScore = (props: TraitScorePropsT) => {
  const {
    trait,
    compareResult = (key: CharacterSkillCheckKeyT) => ZERO_COMPARE,
  } = props
  const { abilitiesModifiers, statsModifiers } = trait
  const abilityKeys = getKeys(abilitiesModifiers).filter(
    (key) => getTraitValue(trait, key) !== 0,
  )
  const statKeys = getKeys(statsModifiers).filter(
    (key) => getTraitValue(trait, key) !== 0,
  )

  return (
    <div style={{ fontFamily: 'monospace' }}>
      {trait.focusOffset !== 0 && (
        <span>
          {getSign(trait.focusOffset)}
          {Math.abs(trait.focusOffset)} FP
          {trait.healthOffset !== 0 ||
          abilityKeys.length > 0 ||
          statKeys.length > 0
            ? ', '
            : ''}
        </span>
      )}
      {trait.healthOffset !== 0 && (
        <span>
          {getSign(trait.healthOffset)}
          {Math.abs(trait.healthOffset)} HP
          {abilityKeys.length > 0 || statKeys.length > 0 ? ', ' : ''}
        </span>
      )}
      {abilityKeys.map((key, i) => (
        <span key={key}>
          {i > 0 ? ', ' : ''}
          <span
            style={{
              color: compareResult(key)(...BASE_ARGS),
            }}
          >
            {getSign(getTraitValue(trait, key))}
            {Math.abs(getTraitValue(trait, key))} {CharacterKeyMap3[key]}
          </span>
        </span>
      ))}
      {abilityKeys.length > 0 && statKeys.length > 0 && ', '}
      {statKeys.map((key, i) => (
        <span key={key}>
          {i > 0 ? ', ' : ''}
          <span
            style={{
              color: compareResult(key)(...BASE_ARGS),
            }}
          >
            {getSign(getTraitValue(trait, key))}
            {Math.abs(getTraitValue(trait, key))} {CharacterKeyMap3[key]}
          </span>
        </span>
      ))}
    </div>
  )
}
