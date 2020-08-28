import React, { useContext } from 'react'
import { useRollContext } from '../RollContext'
import { getCompareFn, CompareResultFn, ZERO_COMPARE } from '../../util/compare'
import { CharacterRollT, CharacterCheckT } from '../../types/Roll2'

export type CompareKeyT = 'a' | 'b'
export interface CompareContextT<T> extends Record<CompareKeyT, T> {
  compareChecks: (
    checkA: CharacterCheckT,
    checkB: CharacterCheckT,
  ) => CompareResultFn
  compareRolls: (
    rollA: CharacterRollT,
    rollB: CharacterRollT,
  ) => CompareResultFn
  compareValues: (valueA: number, valueB: number) => CompareResultFn
}
export const CompareContext = React.createContext<CompareContextT<any>>({
  a: null,
  b: null,
  compareChecks: (checkA: CharacterCheckT, checkB: CharacterCheckT) =>
    ZERO_COMPARE,
  compareRolls: (rollA: CharacterRollT, rollB: CharacterRollT) => ZERO_COMPARE,
  compareValues: (valueA: number, valueB: number) => ZERO_COMPARE,
})

export function useCompareContext<T>(): CompareContextT<T> {
  return useContext(CompareContext)
}

export interface CompareContextProviderProps<T> extends Record<CompareKeyT, T> {
  children: React.ReactNode | React.ReactNode[]
}
export function CompareContextProvider<T>(
  props: CompareContextProviderProps<T>,
) {
  const { a, b, children } = props
  const { execRoll, getProbability } = useRollContext()
  const compareChecks = (checkA: CharacterCheckT, checkB: CharacterCheckT) => {
    const a = getProbability(checkA)
    const b = getProbability(checkB)
    return getCompareFn(a, b)
  }
  const compareRolls = (rollA: CharacterRollT, rollB: CharacterRollT) => {
    const a = execRoll(rollA, false).averageTotal as number
    const b = execRoll(rollB, false).averageTotal as number
    return getCompareFn(a, b < 0 ? 0 : b)
  }
  const compareValues = (valueA: number, valueB: number) =>
    getCompareFn(valueA, valueB)
  return (
    <CompareContext.Provider
      value={{ a, b, compareChecks, compareRolls, compareValues }}
    >
      {children}
    </CompareContext.Provider>
  )
}
