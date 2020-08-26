import { useState, useRef } from 'react'
import { useEvent } from './useEvent'

export const useHover = (): [any, boolean] => {
  const [value, setValue] = useState<boolean>(false)
  const ref = useRef()
  const node = ref.current
  useEvent('mouseover', () => setValue(true), node)
  useEvent('mouseout', () => setValue(false), node)
  return [ref, value]
}
