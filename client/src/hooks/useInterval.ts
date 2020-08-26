import { useRef, useState } from 'react'

export const useInterval = (
  onTick: (...args: any[]) => void,
  delay: number = 1000,
) => {
  const [running, setRunning] = useState<boolean>(false)
  const ref = useRef<NodeJS.Timeout | undefined>()
  const start = (...args: any[]) => {
    if (ref.current === undefined) {
      setRunning(true)
      ref.current = setInterval(() => onTick(...args), delay)
    } else {
      clearInterval(ref.current)
      ref.current = setInterval(() => onTick(...args), delay)
    }
  }
  const stop = () => {
    if (ref.current !== undefined) {
      setRunning(false)
      clearInterval(ref.current)
      ref.current = undefined
    }
  }

  return { start, stop, running }
}
