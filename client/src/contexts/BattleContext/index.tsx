import React, { useContext, useState, useMemo, useEffect } from 'react'
import { useCharacterContext } from '../CharacterContext'
import { makeNpc } from '../../objects/makeNpc'
import {
  CharacterT,
  processCharacter,
  ProcessedCharacterT,
} from '../../types/Character'
import { execAttack } from './util'
import { AttackResultT, ZERO_RESULT, useAttackContext } from '../AttackContext'
import { useRollContext } from '../RollContext'
import { BattleT } from '../../types/Battle'
import { getKeys } from '../../util/getKeys'
import { useHistory } from 'react-router'

export interface BattleContextT {
  characters: ProcessedCharacterT[]
  rawCharacters: CharacterT[]
  battle: BattleT
  wins: number
  pushAttack: (targetId: string, sourceId: string) => void
  attack: (targetId: string, sourceId: string) => AttackResultT
  updateCharacter: (character: CharacterT) => void
  reset: () => void
}
export const BattleContext = React.createContext<BattleContextT>({
  characters: [],
  rawCharacters: [],
  battle: {
    rounds: [],
  },
  wins: 0,
  pushAttack: (t, s) => {},
  attack: (t, s) => ZERO_RESULT,
  updateCharacter: (c) => {},
  reset: () => {},
})
export const useBattleContext = () => useContext(BattleContext)

export interface BattleContextProviderPropsT {
  children: React.ReactNode | React.ReactNode[]
}
export const BattleContextProvider = (props: BattleContextProviderPropsT) => {
  const { children } = props
  const history = useHistory()
  const { rawCharacter } = useCharacterContext()
  const { checkCharacter, basicRollCharacter } = useRollContext()
  const { addAttackResult } = useAttackContext()
  const [wins, setWins] = useState(0)

  const enemy = useMemo(() => makeNpc(), [])
  const [characters, setCharacters] = useState<CharacterT[]>([
    rawCharacter,
    enemy,
  ])
  const reset = () => setCharacters([rawCharacter, enemy])
  const processedCharacters = useMemo(
    () => characters.map((c) => processCharacter(c)),
    [characters],
  )
  const [battle, setBattle] = useState<BattleT>({
    rounds: [
      {
        [enemy.id]: {
          targetId: rawCharacter.id,
          skill: undefined,
        },
      },
    ],
  })

  const pushAttack = (targetId: string, sourceId: string) => {
    setBattle((b) => ({
      ...b,
      rounds: b.rounds.map((round, i) =>
        i === b.rounds.length - 1
          ? {
              ...round,
              [sourceId]: {
                targetId,
                skill: undefined,
              },
            }
          : round,
      ),
    }))
  }

  const removeCharacter = (id: string) =>
    setCharacters((cs) => cs.filter((c) => c.id !== id))

  const addNewNpc = () =>
    setCharacters((cs) => [...cs, { ...makeNpc(), id: enemy.id }])

  const updateCharacter = (char: CharacterT): void =>
    setCharacters((chars) => chars.map((c) => (c.id === char.id ? char : c)))

  const attack = (targetId: string, sourceId: string): AttackResultT => {
    const attackResult = execAttack(
      processedCharacters,
      checkCharacter,
      basicRollCharacter,
    )(targetId, sourceId)
    const target = characters.find((c) => c.id === targetId)
    if (target) {
      updateCharacter({
        ...target,
        healthOffset: target.healthOffset += attackResult.totalDamage,
      })
    }
    return attackResult
  }

  useEffect(() => {
    const pc = processedCharacters.find(
      (c) => c.id === rawCharacter.id,
    ) as ProcessedCharacterT
    if (pc && pc.healthOffset < pc.stats.health) {
      processedCharacters.forEach((c) => {
        if (c.id === rawCharacter.id) return
        if (c.healthOffset >= c.stats.health) {
          removeCharacter(c.id)
          addNewNpc()
          setWins((w) => w + 1)
          setBattle((b) => ({
            rounds: [
              {
                [enemy.id]: {
                  targetId: rawCharacter.id,
                  skill: undefined,
                },
              },
            ],
          }))
        }
      })
    } else {
      alert(`you died (${wins} wins)`)
      history.push('/')
    }
  }, [processedCharacters])

  useEffect(() => {
    const { rounds } = battle
    const roundIndex = rounds.length - 1
    const round = rounds[roundIndex]
    if (round && getKeys(round).length === characters.length) {
      const sortedCharacters = processedCharacters.sort(
        (a, b) => b.stats.agility - a.stats.agility,
      )
      sortedCharacters.forEach((character) => {
        console.log(character.name + ' is attacking')
        const rounds = battle.rounds[roundIndex]
        console.log(character.id, rounds)
        const action = battle.rounds[roundIndex][character.id]
        if (action && character.healthOffset <= character.stats.health) {
          addAttackResult({
            ...attack(action.targetId, character.id),
            label: `${character.name} is attacking... (AGL = ${character.stats.agility})`,
          })
        }
      })
      setBattle((b) => ({
        ...b,
        rounds: [
          ...b.rounds,
          {
            [enemy.id]: {
              targetId: rawCharacter.id,
              skill: undefined,
            },
          },
        ],
      }))
    }
  }, [battle])

  useEffect(() => {
    const interval = setInterval(() => {
      pushAttack(enemy.id, rawCharacter.id)
    }, 1000)
    return () => {
      clearInterval()
    }
  }, [])

  return (
    <BattleContext.Provider
      value={{
        characters: processedCharacters,
        rawCharacters: characters,
        battle,
        wins,
        attack,
        pushAttack,
        updateCharacter,
        reset,
      }}
    >
      {children}
    </BattleContext.Provider>
  )
}
