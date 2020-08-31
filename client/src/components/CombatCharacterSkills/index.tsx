import React, { CSSProperties } from 'react'
import Tooltip from 'react-tooltip-lite'
import { SkillT } from '../../types/Skill'
import { BoxContainer } from '../../elements/box'
import { useCharacterContext } from '../../contexts/CharacterContext'
import { BASIC_ATTACK, INSPECT } from '../../objects/makeSkill'
import { SkillPreview } from '../SkillPreview'
import { Hover } from '../Hover'
import { FlexContainer } from '../../elements/flex'

const size = 34
export interface CombatCharacterSkillsPropsT {
  activeSkillId?: string
  skills: SkillT[]
  onClick: (skillId: string) => void
}
export const CombatCharacterSkills = (props: CombatCharacterSkillsPropsT) => {
  const { activeSkillId = BASIC_ATTACK.id, skills, onClick } = props
  const { character } = useCharacterContext()
  const active = (skillId: string) => activeSkillId === skillId
  const disabled = (skill: SkillT) =>
    character.dead ||
    character.stats.focus - character.focusOffset < skill.focusCost

  return (
    <FlexContainer style={{ marginBottom: 2 }}>
      {skills.map((skill) => (
        <CombatCharacterSkill
          key={skill.id}
          skill={skill}
          disabled={disabled(skill)}
          onClick={() => onClick(skill.id)}
          style={{
            padding: 0,
            height: size + 2,
            maxWidth: size + 2,
            margin: 0,
            borderColor: 'transparent',
            opacity: disabled(skill) ? 0.2 : active(skill.id) ? 1 : 0.7,
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
  const isDefault = skill.id === INSPECT.id
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
          <BoxContainer
            onClick={() => !disabled && onClick(skill.id)}
            substyle={{
              borderColor: isHovering ? '#999' : '#555',
              padding: '4px',
              cursor: disabled ? 'default' : 'pointer',
              background: disabled ? '#444' : '#111',
              ...style,
            }}
            style={{ border: 'none' }}
          >
            {skill.imgSrc && (
              <img
                src={skill.imgSrc}
                height={size}
                width={size}
                style={{
                  height: size,
                  maxWidth: size,
                  boxSizing: 'border-box',
                  border: '1px solid black',
                }}
              />
            )}
          </BoxContainer>
        </Tooltip>
      )}
    </Hover>
  )
}
