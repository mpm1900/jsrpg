import React, { useState } from 'react'
import Color from 'color'
import Tooltip from 'react-tooltip-lite'
import { BoxContainer } from '../../elements/box'
import { FlexContainer, FullContainer } from '../../elements/flex'

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
  const p = (value / max) * 100
  const percentage = p > 100 ? 100 : p
  return (
    <Tooltip
      isOpen={hovering}
      direction='right'
      tagName='div'
      padding='0'
      content={<BoxContainer>{`${name} (${value} / ${max})`}</BoxContainer>}
    >
      <BoxContainer
        substyle={{
          padding: 0,
          backgroundColor: '#555',
          height: height - 2,
          position: 'relative',
        }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <FlexContainer
          style={{
            position: 'absolute',
            left: 0,
            boxSizing: 'border-box',
            height: height - 2,
            maxWidth: `${percentage}%`,
            minWidth: `${percentage}%`,
            border:
              percentage > 0
                ? `1px solid ${Color(color).lighten(0.5)}`
                : 'none',
            boxShadow: 'inset 1px 1px 0px rgba(0,0,0,0.5)',
            textShadow: '1px 1px 1px black',
            backgroundColor: color,
            color: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.5s',
          }}
        ></FlexContainer>
        <FullContainer
          style={{
            position: 'absolute',
            height,
            lineHeight: `${height - 2}px`,
            right: 4,
            top: 0,
            fontFamily: 'monospace',
            fontWeight: 'bold',
            overflow: 'hidden',
            textShadow: '0px 0px 3px black',
          }}
        >
          {children}
        </FullContainer>
      </BoxContainer>
    </Tooltip>
  )
}
