import React from 'react'
import { WeaponT } from '../../types/Weapon'
import { DamageTypeKeyT, DamageTypeKeyColors } from '../../types/Damage'
import { FlexContainer } from '../../elements/flex'
import { getRollText, RollCheckT } from '../../types/Roll'
import { Icon } from '../Icon'
import { IconDamageTypeMap } from '../../icons/maps'
import { BoxContainer } from '../../elements/box'
import { useRollContext } from '../../contexts/RollContext'
import { DiceRoll } from 'rpg-dice-roller'
import { getKeys } from '../../util/getKeys'
import { CompareResultFn, ZERO_COMPARE, BASE_ARGS } from '../../util/compare'

export interface DamageRollScoresPropsT {
  weapon: WeaponT
  children: (values: DamageRollScorePropsT[]) => any
}
export const DamageRollScores = (props: DamageRollScoresPropsT) => {
  const { weapon, children } = props
  const { damageRolls } = weapon
  const { execRoll } = useRollContext()
  const keys: DamageTypeKeyT[] = getKeys(damageRolls).filter(
    (key) => damageRolls[key],
  )
  const getDamageRange = (roll: RollCheckT) => {
    const result = execRoll(roll, false)
    const resultRoll = result.__roll as DiceRoll
    return `${resultRoll.minTotal > 0 ? resultRoll.minTotal : 0}-${
      resultRoll.maxTotal
    }`
  }

  return (
    <BoxContainer
      style={{ whiteSpace: 'nowrap' }}
      substyle={{ padding: '4px 10px', background: '#111' }}
    >
      {children(
        keys.map((key) => ({
          id: key,
          key,
          damageRangeText: getDamageRange(damageRolls[key] as RollCheckT),
          damageRollText: getRollText(damageRolls[key] as RollCheckT),
        })),
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
