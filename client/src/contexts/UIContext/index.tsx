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
  const [logKey, _setLogKey] = useState<string | undefined>()
  const [sidebarKey, _setSidebarKey] = useState<string | undefined>()
  const setLogKey = (key?: string) => {
    _setLogKey(key === logKey ? undefined : key)
  }
  const setSidebarKey = (key?: string) => {
    _setSidebarKey(key === sidebarKey ? undefined : key)
  }

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
