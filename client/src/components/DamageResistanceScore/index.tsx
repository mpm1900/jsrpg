import React from 'react'
import { DamageTypeKeyT, DamageTypeKeyColors } from '../../types/Damage'
import { useCharacterContext } from '../../contexts/CharacterContext'
import { FlexContainer } from '../../elements/flex'
import { useRollContext } from '../../contexts/RollContext'
import { Icon } from '../Icon'
import { IconDamageTypeMap } from '../../icons/maps'
import { BoxContainer } from '../../elements/box'
import {
  CharacterRollT,
  getRollRange,
  reduceCharacterRoll,
} from '../../types/Roll2'

export interface DamageResistanceScorePropsT {
  id: DamageTypeKeyT
}
export const DamageResistanceScore = (props: DamageResistanceScorePropsT) => {
  const { id } = props
  const { character } = useCharacterContext()
  const { execRoll } = useRollContext()
  const { damageResistances } = character
  const roll = damageResistances[id] as CharacterRollT
  const rollText = roll
    ? `(${getRollRange(reduceCharacterRoll(roll, character))})`
    : ''
  const iconUrl = IconDamageTypeMap[id]
  const fill = DamageTypeKeyColors[id]

  return (
    <BoxContainer
      style={{ flex: 1 }}
      substyle={{
        display: 'flex',
        whiteSpace: 'nowrap',
        fontFamily: 'monospace',
        alignItems: 'center',
      }}
    >
      <div style={{ flex: 1, marginRight: 20 }}>
        <FlexContainer>
          <Icon
            size={18}
            src={iconUrl}
            fill={fill}
            style={{ marginRight: 10 }}
          />
          <a href='#' onClick={() => (roll ? execRoll(roll) : null)}>
            {id}
          </a>
        </FlexContainer>
      </div>
      <div>{rollText ? rollText : 0}</div>
    </BoxContainer>
  )
}
