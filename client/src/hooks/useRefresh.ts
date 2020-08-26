import { useState } from 'react'
import { v4 } from 'uuid'

export const useRefresh = (): [string | null, (r?: boolean) => void] => {
  const [v, set] = useState<string | null>(null)
  return [v, (r?: boolean) => set(r ? null : v4())]
}
