import React from 'react'

export interface BoxContainerPropsT extends React.HTMLProps<HTMLDivElement> {
  substyle?: React.CSSProperties
  tag?: any
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
