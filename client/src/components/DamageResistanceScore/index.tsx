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
import { Monodiv, Monospace } from '../../elements/monospace'

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
    ? `${getRollRange(reduceCharacterRoll(roll, character))}`
    : ''
  const iconUrl = IconDamageTypeMap[id]
  const fill = DamageTypeKeyColors[id]

  return (
    <BoxContainer
      style={{ flex: 1 }}
      substyle={{
        display: 'flex',
        whiteSpace: 'nowrap',
        alignItems: 'center',
        background: '#222',
        boxShadow: 'inset -1px 0px 10px black',
        fontSize: 14,
      }}
    >
      <FlexContainer style={{ alignItems: 'center', flex: 1, marginRight: 10 }}>
        <Icon size={18} src={iconUrl} fill={fill} style={{ marginRight: 10 }} />
        <Monospace
          style={{
            color: 'rgba(255,255,255,0.5)',
            textShadow: '1px 1px 0px black',
          }}
          onClick={() => (roll ? execRoll(roll) : null)}
        >
          {id.toLocaleUpperCase()}
        </Monospace>
      </FlexContainer>
      <Monospace style={{ fontWeight: 800 }}>
        {rollText ? rollText : 0}
      </Monospace>
    </BoxContainer>
  )
}
