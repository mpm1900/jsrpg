import { useEffect } from 'react'

export const useEvent = (
  name: string,
  handler: () => void,
  target?: HTMLElement,
  options?: any,
) => {
  useEffect(() => {
    if (!target) return
    target.addEventListener(name, handler, options)
    return () => {
      target.removeEventListener(name, handler, options)
    }
  }, [name, handler, target, options])
}
