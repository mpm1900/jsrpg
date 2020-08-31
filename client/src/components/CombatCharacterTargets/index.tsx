import React, { CSSProperties, useState } from 'react'
import Tooltip from 'react-tooltip-lite'
import { useCombatContext } from '../../contexts/CombatContext'
import { BoxContainer, BoxButton } from '../../elements/box'
import Dice6 from '../../icons/svg/delapouite/dice-six-faces-six.svg'
import { Icon } from '../Icon'
import { FlexContainer } from '../../elements/flex'
import { useCharacterContext } from '../../contexts/CharacterContext'
import Roll from '../../assets/img/roll.png'
import { Hover } from '../Hover'
import { BASE_CHARACTER } from '../../objects/baseCharacter'

const size = 34
export interface CombatCharacterTargetsPropsT {
  activeTargetId?: string
  showRandom?: boolean
  onClick: (targetId?: string) => void
}
export const CombatCharacterTargets = (props: CombatCharacterTargetsPropsT) => {
  const { activeTargetId, showRandom = true, onClick } = props
  const { enemyParty } = useCombatContext()
  const cc = useCharacterContext()
  const active = (targetId?: string) => activeTargetId === targetId
  const characters = enemyParty ? enemyParty.characters : []
  return (
    <FlexContainer>
      {showRandom && (
        <BoxButton
          disabled={cc.character.id !== BASE_CHARACTER.id && cc.character.dead}
          onClick={() => !cc.character.dead && onClick(undefined)}
          style={{ border: 'none' }}
          substyle={{
            cursor: cc.character.dead ? 'default' : 'pointer',
            background: cc.character.dead ? '#444' : '#111',
            padding: 0,
            height: size + 2,
            width: size + 2,
            boxSizing: 'border-box',
            borderColor: 'transparent',
            opacity: activeTargetId === undefined ? 1 : 0.5,
            margin: 0,
            ...(active(undefined) ? { borderColor: 'turquoise' } : {}),
          }}
          // style={{ marginRight: 16 }}
        >
          <img
            alt='random'
            src={Roll}
            height={size}
            width={size}
            style={{
              height: size,
              width: size,
              boxSizing: 'border-box',
              border: '1px solid black',
            }}
          />
        </BoxButton>
      )}
      {characters.map((character) => (
        <CombatCharacterTarget
          key={character.id}
          name={character.name}
          onClick={() => onClick(character.id)}
          disabled={
            (cc.character.id !== BASE_CHARACTER.id && cc.character.dead) ||
            character.dead
          }
          style={{
            padding: 0,
            height: size + 2,
            width: size + 2,
            boxSizing: 'border-box',
            margin: 0,
            borderColor: 'transparent',
            opacity:
              (cc.character.id !== BASE_CHARACTER.id && cc.character.dead) ||
              character.dead
                ? 0.5
                : active(character.id)
                ? 1
                : 0.7,
            ...(active(character.id) ? { borderColor: 'turquoise' } : {}),
          }}
        />
      ))}
      <FlexContainer $full />
    </FlexContainer>
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
  return (
    <Hover>
      {({ isHovering }) => (
        <Tooltip
          isOpen={isHovering}
          direction='up'
          tagName='div'
          padding='0'
          arrow={false}
          content={<BoxContainer>{name}</BoxContainer>}
        >
          <BoxContainer
            onClick={() => !disabled && onClick()}
            disabled={disabled}
            substyle={{
              borderColor: isHovering ? '#999' : '#555',
              padding: '4px',
              cursor: disabled ? 'default' : 'pointer',
              background: disabled ? '#444' : '#111',
              ...style,
            }}
            style={{ border: 'none' }}
          >
            <img
              alt='profile'
              src={`https://picsum.photos/seed/${name}/60/60`}
              style={{
                height: size,
                width: size,
                boxSizing: 'border-box',
                border: '1px solid black',
              }}
            />
          </BoxContainer>
        </Tooltip>
      )}
    </Hover>
  )
}
