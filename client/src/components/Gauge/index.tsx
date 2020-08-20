import React, { useState } from 'react'
import Color from 'color'
import Tooltip from 'react-tooltip-lite'
import { BoxContainer } from '../../elements/box'
import { FlexContainer } from '../../elements/flex'

export interface GaugePropsT {
  name?: string
  color: string
  height?: number
  max: number
  value: number
  children?: React.ReactNode | React.ReactNode[]
}
export const Gauge = (props: GaugePropsT) => {
  const { name = '', value, max, color, height = 30, children } = props
  const [hovering, setHovering] = useState(false)
  return (
    <Tooltip
      isOpen={hovering}
      direction='right'
      tagName='div'
      padding='0'
      content={<BoxContainer>{`${name} (${value} / ${max})`}</BoxContainer>}
    >
      <BoxContainer
        substyle={{ padding: 0, backgroundColor: '#111', height: height - 2 }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {value > 0 && (
          <FlexContainer
            style={{
              height: height - 2,
              width: `${(value / max) * 100}%`,
              maxWidth: '100%',
              border: `1px solid ${Color(color).lighten(0.5)}`,
              boxShadow: 'inset 1px 1px 0px rgba(0,0,0,0.5)',
              textShadow: '1px 1px 1px black',
              backgroundColor: color,
              color: 'white',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {children}
          </FlexContainer>
        )}
      </BoxContainer>
    </Tooltip>
  )
}
