import React from 'react'
import { useCombatContext } from '../../contexts/CombatContext'
import { BoxContainer, BoxButton } from '../../elements/box'
import Dice6 from '../../icons/svg/delapouite/dice-six-faces-six.svg'
import { Icon } from '../Icon'
import { FlexContainer } from '../../elements/flex'

export interface CombatCharacterTargetsPropsT {
  activeTargetId?: string
  onClick: (targetId?: string) => void
}
export const CombatCharacterTargets = (props: CombatCharacterTargetsPropsT) => {
  const { activeTargetId, onClick } = props
  const { enemyParty } = useCombatContext()
  const active = (targetId?: string) => activeTargetId === targetId
  const characters = enemyParty ? enemyParty.characters : []
  return (
    <BoxContainer substyle={{ display: 'flex', padding: 0 }}>
      {characters.map((character) => (
        <BoxButton
          key={character.id}
          onClick={() => onClick(character.id)}
          disabled={character.dead}
          substyle={{
            ...(active(character.id) ? { borderColor: 'white' } : {}),
          }}
        >
          {character.name}
        </BoxButton>
      ))}
      <FlexContainer $full />
      <BoxButton
        onClick={() => onClick(undefined)}
        substyle={{
          ...(active(undefined) ? { borderColor: 'white' } : {}),
        }}
      >
        <Icon src={Dice6} size={16} />
      </BoxButton>
    </BoxContainer>
  )
}
