import React from 'react'
import { WeaponT } from '../../types/Weapon'
import {
  DamageTypeKeyT,
  DamageTypeKeyColors,
  DamageTypeRollsT,
} from '../../types/Damage'
import { FlexContainer } from '../../elements/flex'
import { Icon } from '../Icon'
import { IconDamageTypeMap } from '../../icons/maps'
import { BoxContainer } from '../../elements/box'
import { getKeys } from '../../util/getKeys'
import { CompareResultFn, ZERO_COMPARE, BASE_ARGS } from '../../util/compare'
import {
  CharacterRollT,
  getRollText,
  getRollRange,
  reduceCharacterRoll,
  combineCharacterRolls,
} from '../../types/Roll2'
import { useCharacterContext } from '../../contexts/CharacterContext'

export interface HasDamageRollsT {
  damageRolls: DamageTypeRollsT
}
export interface DamageRollScoresPropsT {
  parent: HasDamageRollsT
  children: (
    values: DamageRollScorePropsT[],
    combinedRoll: CharacterRollT,
  ) => any
}
export const DamageRollScores = (props: DamageRollScoresPropsT) => {
  const { parent, children } = props
  const { character } = useCharacterContext()
  const { damageRolls } = parent
  const keys: DamageTypeKeyT[] = getKeys(damageRolls).filter(
    (key) => damageRolls[key],
  )
  const rolls = keys
    .map((key) => damageRolls[key])
    .filter((roll) => roll) as CharacterRollT[]

  const getDamageRange = (roll: CharacterRollT) => {
    return getRollRange(reduceCharacterRoll(roll, character))
  }

  return (
    <BoxContainer
      style={{ whiteSpace: 'nowrap' }}
      substyle={{
        padding: '4px 10px',
        borderColor: 'rgba(255,255,255,0.3)',
        background: 'rgba(0,0,0,0.75)',
      }}
    >
      {children(
        keys.map((key) => ({
          id: key,
          key,
          damageRangeText: getDamageRange(damageRolls[key] as CharacterRollT),
          damageRollText: getRollText(damageRolls[key] as CharacterRollT),
        })),
        combineCharacterRolls(...rolls),
      )}
    </BoxContainer>
  )
}

export interface DamageRollScorePropsT {
  id: DamageTypeKeyT
  damageRangeText: string
  damageRollText: string
  compareResult?: CompareResultFn
}
export const DamageRollScore = (props: DamageRollScorePropsT) => {
  const {
    id,
    damageRangeText,
    damageRollText,
    compareResult = ZERO_COMPARE,
  } = props
  if (!damageRollText) return null
  return (
    <FlexContainer
      key={id}
      style={{
        alignItems: 'flex-end',
        padding: '4px 0',
        height: 24,
        lineHeight: '24px',
      }}
    >
      <h3 style={{ margin: '0 8px 0 0' }}>
        <span
          style={{
            color: compareResult(...BASE_ARGS),
          }}
        >
          ({damageRangeText})
        </span>{' '}
        <span style={{ color: 'rgba(255,255,255, 0.5)' }}>
          {damageRollText}
        </span>
      </h3>
      <Icon
        src={IconDamageTypeMap[id]}
        size={20}
        fill={DamageTypeKeyColors[id]}
        style={{ marginBottom: 2 }}
      />
    </FlexContainer>
  )
}
