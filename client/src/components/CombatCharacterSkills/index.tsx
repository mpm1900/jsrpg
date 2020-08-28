import React from 'react'
import { CharacterSkillT } from '../../types/Character'
import { BoxContainer, BoxButton } from '../../elements/box'
import { useCharacterContext } from '../../contexts/CharacterContext'
import { BASIC_ATTACK } from '../../objects/makeSkill'

export interface CombatCharacterSkillsPropsT {
  activeSkillId?: string
  skills: CharacterSkillT[]
  onClick: (skillId: string) => void
}
export const CombatCharacterSkills = (props: CombatCharacterSkillsPropsT) => {
  const { activeSkillId = BASIC_ATTACK.id, skills, onClick } = props
  const { character } = useCharacterContext()
  const active = (skillId: string) => activeSkillId === skillId
  return (
    <BoxContainer substyle={{ display: 'flex', padding: 0 }}>
      {skills.map((skill) => (
        <BoxButton
          key={skill.id}
          disabled={
            character.dead ||
            character.stats.focus - character.focusOffset < skill.focusCost
          }
          onClick={() => onClick(skill.id)}
          substyle={{
            ...(active(skill.id) ? { borderColor: 'white' } : {}),
          }}
        >
          {skill.name}
        </BoxButton>
      ))}
    </BoxContainer>
  )
}
