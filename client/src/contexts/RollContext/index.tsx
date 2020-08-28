import React, { useContext } from 'react'
import { ProcessedCharacterT, CharacterT } from '../../types/Character'
import { useCharacterContext } from '../CharacterContext'
import { useRolls, actionCreators } from '../../state/rolls'
import { useDispatch } from 'react-redux'
import {
  Roll2T,
  Check2T,
  Roll2ResultT,
  resolveCharacterRoll,
  CharacterRollT,
  CharacterCheckT,
  resolveCharacterCheck,
  resolveRoll,
  resolveCheck,
  getCheckProbability,
  reduceCharacterCheck,
  Check2ResultT,
} from '../../types/Roll2'

export type RollCheckerT<T, R> = (
  roll: T,
  log?: boolean,
  allowNegatives?: boolean,
  label?: string,
) => R
export interface RollContextT {
  history: Roll2ResultT[]
  execRoll: RollCheckerT<Roll2T | CharacterRollT, Roll2ResultT>
  execCheck: RollCheckerT<Check2T | CharacterCheckT, Check2ResultT>
  rollCharacter: (
    c: ProcessedCharacterT,
  ) => RollCheckerT<CharacterRollT, Roll2ResultT>
  checkCharacter: (
    c: ProcessedCharacterT,
  ) => RollCheckerT<CharacterCheckT, Check2ResultT>
  getProbability: (check: CharacterCheckT, log?: boolean) => number
}
export const RollContext = React.createContext<RollContextT>({
  history: [],
  execRoll: (roll) => ({} as Roll2ResultT),
  execCheck: (roll) => ({} as Check2ResultT),
  rollCharacter: (c) => (roll, log, allowNegatives) =>
    resolveCharacterRoll(roll, c),
  checkCharacter: (c) => (roll, log, allowNegatives) =>
    resolveCharacterCheck(roll, c),
  getProbability: (roll) => 0,
})
export const useRollContext = () => useContext(RollContext)

export interface RollContextProviderPropsT {
  children: any
  rolls: (Roll2ResultT | Check2ResultT)[]
  character?: ProcessedCharacterT
  addRoll: (roll: Roll2ResultT | Check2ResultT, label?: string) => void
}
export const RollContextProvider = (props: RollContextProviderPropsT) => {
  const { children, rolls, addRoll } = props
  const characterContext = useCharacterContext()
  const character = props.character || characterContext.character
  return (
    <RollContext.Provider
      value={{
        history: rolls,
        execRoll: (roll, log = true, allowNegatives, label) => {
          const result: Roll2ResultT = (roll as CharacterRollT).keys
            ? resolveCharacterRoll(
                roll as CharacterRollT,
                character,
                allowNegatives,
              )
            : resolveRoll(roll, allowNegatives)
          if (log) addRoll(result, label)
          return result
        },
        execCheck: (check, log = true, allowNegatives, label) => {
          const result: Check2ResultT = (check as CharacterCheckT).keys
            ? resolveCharacterCheck(
                check as CharacterCheckT,
                character,
                allowNegatives,
              )
            : resolveCheck(check, allowNegatives)
          if (log) addRoll(result, label)
          return result
        },
        rollCharacter: (
          character,
        ): RollCheckerT<CharacterRollT, Roll2ResultT> => {
          return (
            roll: CharacterRollT,
            log = true,
            allowNegatives = false,
            label,
          ) => {
            const result = resolveCharacterRoll(roll, character, allowNegatives)
            if (log) addRoll(result, label)
            return result
          }
        },
        checkCharacter: (character) => {
          return (
            check: CharacterCheckT,
            log = true,
            allowNegatives = false,
            label,
          ) => {
            const result = resolveCharacterCheck(
              check,
              character,
              allowNegatives,
            )
            if (log) addRoll(result, label)
            return result
          }
        },
        getProbability: (check, log: boolean = false) => {
          return getCheckProbability(reduceCharacterCheck(check, character))
        },
      }}
    >
      {children}
    </RollContext.Provider>
  )
}

export interface RollStateContextProviderPropsT {
  children: any
  character?: ProcessedCharacterT
}
export const RollStateContextProvider = (
  props: RollStateContextProviderPropsT,
) => {
  const { children, character } = props
  const rolls = useRolls()
  const dispatch = useDispatch()
  const addRoll = (roll: Roll2ResultT, label?: string) => {
    dispatch(actionCreators.addRoll({ ...roll, label }))
  }
  return (
    <RollContextProvider rolls={rolls} addRoll={addRoll} character={character}>
      {children}
    </RollContextProvider>
  )
}
