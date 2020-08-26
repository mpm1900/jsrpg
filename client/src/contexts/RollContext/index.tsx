import React, { useContext } from 'react'
import { RollResultT, RollCheckT, basicRoll } from '../../types/Roll'
import {
  checkCharacter,
  basicRollCharacter,
  ProcessedCharacterT,
  getCharacterCheckProbability,
  CharacterT,
} from '../../types/Character'
import { useCharacterContext } from '../CharacterContext'
import { useRolls, actionCreators } from '../../state/rolls'
import { useDispatch } from 'react-redux'

export type RollCheckerT = (
  roll: RollCheckT,
  log?: boolean,
  allowNegatives?: boolean,
) => RollResultT
export interface RollContextT {
  history: RollResultT[]
  execRoll: (
    roll: RollCheckT,
    log?: boolean,
    allowNegatives?: boolean,
  ) => RollResultT
  execCheck: RollCheckerT
  execStaticRoll: RollCheckerT
  basicRollCharacter: (c: ProcessedCharacterT) => RollCheckerT
  checkCharacter: (c: ProcessedCharacterT) => RollCheckerT
  getProbability: (roll: RollCheckT) => number
}
export const RollContext = React.createContext<RollContextT>({
  history: [],
  execRoll: (roll) => ({} as RollResultT),
  execCheck: (roll) => ({} as RollResultT),
  execStaticRoll: (roll) => ({} as RollResultT),
  basicRollCharacter,
  checkCharacter,
  getProbability: (roll) => 0,
})
export const useRollContext = () => useContext(RollContext)

export interface RollContextProviderPropsT {
  children: any
  rolls: RollResultT[]
  character?: ProcessedCharacterT
  addRoll: (roll: RollResultT) => void
}
export const RollContextProvider = (props: RollContextProviderPropsT) => {
  const { children, rolls, addRoll } = props
  const characterContext = useCharacterContext()
  const character = props.character || characterContext.character
  return (
    <RollContext.Provider
      value={{
        history: rolls,
        execRoll: (roll, log = true, allowNegatives) => {
          const result: RollResultT = basicRollCharacter(character)(
            roll,
            allowNegatives,
          )
          if (log) addRoll(result)
          return result
        },
        execCheck: (roll, log = true) => {
          const result: RollResultT = checkCharacter(character)(roll)
          if (log) addRoll(result)
          return result
        },
        execStaticRoll: (roll, log = true, allowNegatives) => {
          const result: RollResultT = basicRoll(roll, allowNegatives)
          if (log) addRoll(result)
          return result
        },
        basicRollCharacter: (character) => {
          return (roll: RollCheckT, log = true, allowNegatives = false) => {
            const result = basicRollCharacter(character)(roll, allowNegatives)
            if (log) addRoll(result)
            return result
          }
        },
        checkCharacter: (character) => {
          return (roll: RollCheckT, log = true, allowNegatives = false) => {
            const result = checkCharacter(character)(roll)
            if (log) addRoll(result)
            return result
          }
        },
        getProbability: (roll) => {
          return getCharacterCheckProbability(character)(roll)
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
  const addRoll = (roll: RollResultT) => {
    dispatch(actionCreators.addRoll(roll))
  }
  return (
    <RollContextProvider rolls={rolls} addRoll={addRoll} character={character}>
      {children}
    </RollContextProvider>
  )
}
