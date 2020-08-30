import React from 'react'
import { FlexContainer } from '../../elements/flex'
import { usePartyContext } from '../../contexts/PartyContext'
import { SkillPreviewAlt } from '../SkillPreviewAlt'

export const PartySkills = () => {
  const { userParty } = usePartyContext()
  return (
    <FlexContainer style={{ width: 320, flexWrap: 'wrap' }}>
      {userParty.skills.map((skill) => (
        <SkillPreviewAlt skill={skill} />
      ))}
    </FlexContainer>
  )
}
