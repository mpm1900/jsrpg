import React, { useState, useEffect } from 'react'
import { timeout } from '../../util/wait'
import { v4 } from 'uuid'

export interface HoverChildrenT {
  isHovering: boolean
}
export interface HoverPropsT {
  children: (props: HoverChildrenT) => JSX.Element
}
export const Hover = (props: HoverPropsT) => {
  const { children } = props
  const [internalHovering, setInternalHovering] = useState<boolean>(false)
  const [isHovering, setIsHovering] = useState<boolean>(false)
  const [guid, setGuid] = useState<string>(v4())
  useEffect(() => {
    const action = async () => {
      if (internalHovering) {
        await timeout(500)
        setGuid(v4())
      }
    }
    action()
  }, [internalHovering])
  useEffect(() => {
    if (internalHovering) {
      setIsHovering(true)
    }
  }, [guid])
  const onMouseEnter = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setInternalHovering(true)
  }
  const onMouseLeave = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setInternalHovering(false)
    setIsHovering(false)
  }
  return (
    <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {children({ isHovering })}
    </div>
  )
}
