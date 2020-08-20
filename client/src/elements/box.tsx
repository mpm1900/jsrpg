import React from 'react'

export interface BoxContainerPropsT extends React.HTMLProps<HTMLDivElement> {
  substyle?: React.CSSProperties
  tag?: any
  to?: string
}
export const BoxContainer = (props: BoxContainerPropsT) => {
  const {
    style = {},
    substyle = {},
    children,
    tag: Element = 'div',
    ...rest
  } = props
  return (
    <div
      style={{
        border: '1px solid #000',
        display: 'flex',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <Element
        style={{
          border: '1px solid #555',
          background: '#222',
          padding: 10,
          color: '#ccc',
          flex: 1,
          ...substyle,
        }}
        {...rest}
      >
        {children}
      </Element>
    </div>
  )
}

export const SmallBox = (props: BoxContainerPropsT) => (
  <BoxContainer
    {...props}
    style={{
      height: 40,
      width: 40,
      ...props.style,
    }}
    substyle={{
      display: 'flex',
      padding: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#111',
      ...props.substyle,
    }}
  >
    {props.children}
  </BoxContainer>
)
