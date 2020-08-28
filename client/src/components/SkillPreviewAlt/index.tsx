import React, { useState } from 'react'
import Tooltip from 'react-tooltip-lite'
import { SkillT } from '../../types/Skill'
import { BoxContainer, SmallBox } from '../../elements/box'
import { FlexContainer, FullContainer } from '../../elements/flex'
import { SkillPreview } from '../SkillPreview'
import { Icon } from '../Icon'
import Inspect from '../../icons/svg/lorc/magnifying-glass.svg'

export interface SkillPreviewAltPropsT {
  skill: SkillT
}
export const SkillPreviewAlt = (props: SkillPreviewAltPropsT) => {
  const { skill } = props
  const [detailsHovering, setDetailsHovering] = useState<boolean>(false)

  return (
    <BoxContainer>
      <FlexContainer style={{ alignItems: 'center' }}>
        <FullContainer style={{ marginRight: 10 }}>
          <h3 style={{ margin: 0, flex: 1 }}>{skill.name}</h3>
        </FullContainer>
        <FlexContainer>
          <Tooltip
            isOpen={detailsHovering}
            direction='right'
            tagName='div'
            padding='0'
            arrow={false}
            content={<SkillPreview skillId={skill.id} skill={skill} />}
          >
            <SmallBox
              onMouseEnter={() => setDetailsHovering(true)}
              onMouseLeave={() => setDetailsHovering(false)}
            >
              <Icon src={Inspect} size={18} />
            </SmallBox>
          </Tooltip>
        </FlexContainer>
      </FlexContainer>
    </BoxContainer>
  )
}
