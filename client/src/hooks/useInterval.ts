import { useRef, useState } from 'react'

export const useInterval = (onTick: () => void, delay: number = 1000) => {
  const [running, setRunning] = useState<boolean>(false)
  const ref = useRef<NodeJS.Timeout | undefined>()
  const start = () => {
    setRunning(true)
    ref.current = setInterval(onTick, delay)
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
