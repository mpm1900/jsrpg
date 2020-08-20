import React, { useContext, useState, useMemo, useEffect } from 'react'
import { useCharacterContext } from '../CharacterContext'
import { makeNpc } from '../../objects/makeNpc'
import {
  CharacterT,
  processCharacter,
  ProcessedCharacterT,
} from '../../types/Character'
import { execAttack } from './util'
import { AttackResultT, ZERO_RESULT } from '../AttackContext'

export interface BattleContextT {
  characters: ProcessedCharacterT[]
  rawCharacters: CharacterT[]
  attack: (targetId: string, sourceId: string) => AttackResultT
  updateCharacter: (character: CharacterT) => void
}
export const BattleContext = React.createContext<BattleContextT>({
  characters: [],
  rawCharacters: [],
  attack: (t, s) => ZERO_RESULT,
  updateCharacter: (c) => {},
})
export const useBattleContext = () => useContext(BattleContext)

export interface BattleContextProviderPropsT {
  children: React.ReactNode | React.ReactNode[]
}
export const BattleContextProvider = (props: BattleContextProviderPropsT) => {
  const { children } = props
  const { rawCharacter } = useCharacterContext()
  const enemy = makeNpc()
  const [characters, setCharacters] = useState<CharacterT[]>([
    rawCharacter,
    enemy,
  ])
  const processedCharacters = useMemo(
    () => characters.map((c) => processCharacter(c)),
    [characters],
  )

  const removeCharacter = (id: string) =>
    setCharacters((cs) => cs.filter((c) => c.id !== id))

  const addNewNpc = () => setCharacters((cs) => [...cs, makeNpc()])

  const updateCharacter = (char: CharacterT): void =>
    setCharacters((chars) => chars.map((c) => (c.id === char.id ? char : c)))

  useEffect(() => {
    processedCharacters.forEach((c) => {
      console.log(c.healthOffset, c.stats.health)
      if (c.healthOffset >= c.stats.health) {
        removeCharacter(c.id)
        addNewNpc()
      }
    })
  }, [processedCharacters])

  const attack = (targetId: string, sourceId: string): AttackResultT => {
    const attackResult = execAttack(processedCharacters)(targetId, sourceId)
    const target = characters.find((c) => c.id === targetId)
    if (target) {
      updateCharacter({
        ...target,
        healthOffset: target.healthOffset += attackResult.totalDamage,
      })
    }
    return attackResult
  }
  return (
    <BattleContext.Provider
      value={{
        characters: processedCharacters,
        rawCharacters: characters,
        attack,
        updateCharacter,
      }}
    >
      {children}
    </BattleContext.Provider>
  )
}
