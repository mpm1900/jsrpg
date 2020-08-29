import React, { CSSProperties, useState } from 'react'
import Tooltip from 'react-tooltip-lite'
import { SkillT } from '../../types/Skill'
import { BoxContainer, BoxButton } from '../../elements/box'
import { useCharacterContext } from '../../contexts/CharacterContext'
import { BASIC_ATTACK, INSPECT } from '../../objects/makeSkill'
import { SkillPreview } from '../SkillPreview'
import { Hover } from '../Hover'
import { FlexContainer } from '../../elements/flex'

const size = 32
export interface CombatCharacterSkillsPropsT {
  activeSkillId?: string
  skills: SkillT[]
  onClick: (skillId: string) => void
}
export const CombatCharacterSkills = (props: CombatCharacterSkillsPropsT) => {
  const { activeSkillId = BASIC_ATTACK.id, skills, onClick } = props
  const { character } = useCharacterContext()
  const active = (skillId: string) => activeSkillId === skillId

  return (
    <FlexContainer
      style={{
        backgroundColor: '#1a1a1a',
        borderBottom: '1px solid black',
        borderTop: '1px solid black',
      }}
    >
      {skills.map((skill) => (
        <CombatCharacterSkill
          key={skill.id}
          skill={skill}
          disabled={
            character.dead ||
            character.stats.focus - character.focusOffset < skill.focusCost
          }
          onClick={() => onClick(skill.id)}
          style={{
            padding: 0,
            height: size + 2,
            width: size + 2,
            margin: 0,
            opacity:
              character.dead ||
              character.stats.focus - character.focusOffset < skill.focusCost
                ? 0.2
                : active(skill.id)
                ? 1
                : 0.7,
            ...(active(skill.id) ? { borderColor: 'turquoise' } : {}),
          }}
        />
      ))}
    </FlexContainer>
  )
}

export interface CombatCharacterSkillPropsT {
  skill: SkillT
  disabled: boolean
  style: CSSProperties
  onClick: (skillId: string) => void
}
export const CombatCharacterSkill = (props: CombatCharacterSkillPropsT) => {
  const { skill, disabled, style, onClick } = props
  const isDefault = skill.id === BASIC_ATTACK.id || skill.id === INSPECT.id
  return (
    <Hover>
      {({ isHovering }) => (
        <Tooltip
          isOpen={isHovering}
          direction='down'
          tagName='div'
          padding='0'
          arrow={false}
          content={
            isDefault ? (
              <BoxContainer>{skill.name}</BoxContainer>
            ) : (
              <SkillPreview skillId={skill.id} skill={skill} />
            )
          }
        >
          <BoxButton
            disabled={disabled}
            onClick={() => onClick(skill.id)}
            substyle={style}
          >
            {skill.imgSrc && (
              <img
                src={skill.imgSrc}
                height={size}
                width={size}
                style={{
                  height: size,
                  width: size,
                  boxSizing: 'border-box',
                  border: '2px solid black',
                }}
              />
            )}
          </BoxButton>
        </Tooltip>
      )}
    </Hover>
  )
}
