import React, { CSSProperties, useState } from 'react'
import Tooltip from 'react-tooltip-lite'
import { SkillT } from '../../types/Skill'
import { BoxContainer, BoxButton } from '../../elements/box'
import { useCharacterContext } from '../../contexts/CharacterContext'
import { BASIC_ATTACK, INSPECT } from '../../objects/makeSkill'
import { SkillPreview } from '../SkillPreview'

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
    <BoxContainer substyle={{ display: 'flex', padding: 0 }}>
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
            ...(active(skill.id) ? { borderColor: 'white' } : {}),
          }}
        />
      ))}
    </BoxContainer>
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
  const [isHovering, setIsHovering] = useState<boolean>(false)
  return (
    <Tooltip
      isOpen={
        isHovering && skill.id !== BASIC_ATTACK.id && skill.id !== INSPECT.id
      }
      direction='up'
      tagName='div'
      padding='0'
      arrow={false}
      content={<SkillPreview skillId={skill.id} skill={skill} />}
    >
      <div
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <BoxButton
          disabled={disabled}
          onClick={() => onClick(skill.id)}
          substyle={style}
        >
          {skill.name}
        </BoxButton>
      </div>
    </Tooltip>
  )
}
