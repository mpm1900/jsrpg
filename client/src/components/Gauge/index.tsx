import React from 'react'
import Color from 'color'
import { BoxContainer } from '../../elements/box'
import { FlexContainer } from '../../elements/flex'

export interface GaugePropsT {
  color: string
  height?: number
  max: number
  value: number
  children?: React.ReactNode | React.ReactNode[]
}
export const Gauge = (props: GaugePropsT) => {
  const { value, max, color, height = 30, children } = props
  return (
    <BoxContainer
      substyle={{ padding: 0, backgroundColor: '#111', height: height - 2 }}
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
  )
}
