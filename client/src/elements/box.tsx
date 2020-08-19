import React from 'react'

export interface BoxContainerPropsT extends React.HTMLProps<HTMLDivElement> {
  substyle?: React.CSSProperties
}
export const BoxContainer = (props: BoxContainerPropsT) => {
  const { style = {}, substyle = {}, children, ...rest } = props
  return (
    <div
      style={{
        border: '1px solid #000',
        display: 'flex',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div
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
      </div>
    </div>
  )
}
