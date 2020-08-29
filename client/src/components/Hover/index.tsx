import React, { useState } from 'react'

export interface HoverChildrenT {
  isHovering: boolean
}
export interface HoverPropsT {
  children: (props: HoverChildrenT) => JSX.Element
}
export const Hover = (props: HoverPropsT) => {
  const { children } = props
  const [internalHovering, setInternalHovering] = useState<boolean>(false)
  const onMouseEnter = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setInternalHovering(true)
  }
  const onMouseLeave = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setInternalHovering(false)
  }
  return (
    <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {children({ isHovering: internalHovering })}
    </div>
  )
}
