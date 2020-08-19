import React, { useContext } from 'react'
import { useRollContext } from '../RollContext'
import { RollCheckT } from '../../types/Roll'
import { getCompareFn, CompareResultFn, ZERO_COMPARE } from '../../util/compare'

export type CompareKeyT = 'a' | 'b'
export interface CompareContextT<T> extends Record<CompareKeyT, T> {
  compareChecks: (checkA: RollCheckT, checkB: RollCheckT) => CompareResultFn
  compareRolls: (rollA: RollCheckT, rollB: RollCheckT) => CompareResultFn
  compareValues: (valueA: number, valueB: number) => CompareResultFn
}
export const CompareContext = React.createContext<CompareContextT<any>>({
  a: null,
  b: null,
  compareChecks: (checkA: RollCheckT, checkB: RollCheckT) => ZERO_COMPARE,
  compareRolls: (rollA: RollCheckT, rollB: RollCheckT) => ZERO_COMPARE,
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
  const compareChecks = (checkA: RollCheckT, checkB: RollCheckT) => {
    const a = getProbability(checkA)
    const b = getProbability(checkB)
    return getCompareFn(a, b)
  }
  const compareRolls = (rollA: RollCheckT, rollB: RollCheckT) => {
    rollA = {
      ...rollA,
      roll: rollA.roll || '1d1-1',
    }
    rollB = {
      ...rollB,
      roll: rollB.roll || '1d1-1',
    }
    const a = execRoll(rollA, false).__roll.averageTotal as number
    const b = execRoll(rollB, false).__roll.averageTotal as number
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
