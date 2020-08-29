import React, { useState } from 'react'
import Tooltip from 'react-tooltip-lite'
import { SkillT } from '../../types/Skill'
import { BoxContainer } from '../../elements/box'
import { SkillPreview } from '../SkillPreview'
import { Hover } from '../Hover'

const size = 60
export interface SkillPreviewAltPropsT {
  skill: SkillT
}
export const SkillPreviewAlt = (props: SkillPreviewAltPropsT) => {
  const { skill } = props

  return (
    <BoxContainer
      style={{
        height: size + 4,
        width: size + 4,
      }}
      substyle={{ padding: 0 }}
    >
      <Hover>
        {({ isHovering }) => (
          <Tooltip
            isOpen={isHovering}
            direction='down'
            tagName='div'
            padding='0'
            arrow={false}
            content={<SkillPreview skillId={skill.id} skill={skill} />}
          >
            <img src={skill.imgSrc} height={size} width={size} />
          </Tooltip>
        )}
      </Hover>
    </BoxContainer>
  )
}
