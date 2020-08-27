import React, { useContext, useState } from 'react'

export interface UIContextT {
  logKey: string | undefined
  sidebarKey: string | undefined

  setLogKey: (key?: string) => void
  setSidebarKey: (key?: string) => void
}
const defaultValue: UIContextT = {
  logKey: undefined,
  sidebarKey: undefined,
  setLogKey: () => {},
  setSidebarKey: () => {},
}
export const UIContext = React.createContext<UIContextT>(defaultValue)
export const useUIContext = () => useContext(UIContext)

export interface UIContextProviderPropsT {
  children: React.ReactNode | React.ReactNode[]
}
export const UIContextProvider = (props: UIContextProviderPropsT) => {
  const { children } = props
  const [logKey, setLogKey] = useState<string | undefined>()
  const [sidebarKey, setSidebarKey] = useState<string | undefined>()

  return (
    <UIContext.Provider
      value={{
        logKey,
        sidebarKey,
        setLogKey,
        setSidebarKey,
      }}
    >
      {children}
    </UIContext.Provider>
  )
}
