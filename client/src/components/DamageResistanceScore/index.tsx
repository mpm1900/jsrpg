import React from 'react'
import { DamageTypeKeyT, DamageTypeKeyColors } from '../../types/Damage'
import { useCharacterContext } from '../../contexts/CharacterContext'
import { FlexContainer } from '../../elements/flex'
import { getRollText } from '../../types/Roll'
import { useRollContext } from '../../contexts/RollContext'
import { Icon } from '../Icon'
import { IconDamageTypeMap } from '../../icons/maps'
import { BoxContainer } from '../../elements/box'

export interface DamageResistanceScorePropsT {
  id: DamageTypeKeyT
}
export const DamageResistanceScore = (props: DamageResistanceScorePropsT) => {
  const { id } = props
  const { character } = useCharacterContext()
  const { execStaticRoll } = useRollContext()
  const { damageResistances } = character
  const roll = damageResistances[id]
  const rollText = roll ? getRollText(roll) : ''
  const iconUrl = IconDamageTypeMap[id]
  const fill = DamageTypeKeyColors[id]

  return (
    <BoxContainer
      substyle={{
        display: 'flex',
        whiteSpace: 'nowrap',
        fontFamily: 'monospace',
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
          <a href='#' onClick={() => (roll ? execStaticRoll(roll) : null)}>
            {id}
          </a>
        </FlexContainer>
      </div>
      <div>{rollText ? rollText : 0}</div>
    </BoxContainer>
  )
}
