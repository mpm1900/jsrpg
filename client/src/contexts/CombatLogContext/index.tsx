import React, { useContext, useState } from 'react'

export interface CombatLogContextT {
  lines: React.ReactNode[]
  addLine: (line: React.ReactNode) => void
  clear: () => void
}
export const CombatLogContext = React.createContext<CombatLogContextT>({
  lines: [],
  addLine: (line: React.ReactNode) => {},
  clear: () => {},
})
export const useCombatLogContext = () => useContext(CombatLogContext)

export interface CombatLogContextProviderPropsT {
  children: React.ReactNode | React.ReactNode[]
}
export const CombatLogContextProvider = (
  props: CombatLogContextProviderPropsT,
) => {
  const { children } = props
  const [lines, setLines] = useState<React.ReactNode[]>([])
  const clear = () => setLines([])

  return (
    <CombatLogContext.Provider
      value={{
        lines,
        addLine: (line) => setLines((log) => [...log, line]),
        clear,
      }}
    >
      {children}
    </CombatLogContext.Provider>
  )
}
