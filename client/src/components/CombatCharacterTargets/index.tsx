import React, { CSSProperties, useState } from 'react'
import Tooltip from 'react-tooltip-lite'
import { useCombatContext } from '../../contexts/CombatContext'
import { BoxContainer, BoxButton } from '../../elements/box'
import Dice6 from '../../icons/svg/delapouite/dice-six-faces-six.svg'
import { Icon } from '../Icon'
import { FlexContainer } from '../../elements/flex'
import { useCharacterContext } from '../../contexts/CharacterContext'

const size = 32
export interface CombatCharacterTargetsPropsT {
  activeTargetId?: string
  onClick: (targetId?: string) => void
}
export const CombatCharacterTargets = (props: CombatCharacterTargetsPropsT) => {
  const { activeTargetId, onClick } = props
  const { enemyParty } = useCombatContext()
  const cc = useCharacterContext()
  const active = (targetId?: string) => activeTargetId === targetId
  const characters = enemyParty ? enemyParty.characters : []
  return (
    <BoxContainer
      substyle={{ display: 'flex', padding: 0, backgroundColor: '#111' }}
    >
      {characters.map((character) => (
        <CombatCharacterTarget
          key={character.id}
          name={character.name}
          onClick={() => onClick(character.id)}
          disabled={cc.character.dead || character.dead}
          style={{
            padding: 0,
            height: size + 2,
            width: size + 2,
            boxSizing: 'border-box',
            margin: 0,
            opacity: character.dead ? 0.5 : 1,
            ...(active(character.id) ? { borderColor: 'turquoise' } : {}),
          }}
        />
      ))}
      <FlexContainer $full />
      <BoxButton
        disabled={cc.character.dead}
        onClick={() => onClick(undefined)}
        substyle={{
          ...(active(undefined) ? { borderColor: 'turquoise' } : {}),
        }}
      >
        <Icon src={Dice6} size={24} />
      </BoxButton>
    </BoxContainer>
  )
}

export interface CombatCharacterTargetPropsT {
  name: string
  disabled: boolean
  style: CSSProperties
  onClick: () => void
}
export const CombatCharacterTarget = (props: CombatCharacterTargetPropsT) => {
  const { name, disabled, style, onClick } = props
  const [isHovering, setIsHovering] = useState<boolean>(false)
  return (
    <Tooltip
      isOpen={isHovering}
      direction='up'
      tagName='div'
      padding='0'
      arrow={false}
      content={<BoxContainer>{name}</BoxContainer>}
    >
      <div
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <BoxButton onClick={onClick} disabled={disabled} substyle={style}>
          <img
            alt='profile'
            src={`https://picsum.photos/seed/${name}/60/60`}
            style={{
              height: size,
              width: size,
              boxSizing: 'border-box',
              border: '2px solid black',
            }}
          />
        </BoxButton>
      </div>
    </Tooltip>
  )
}
