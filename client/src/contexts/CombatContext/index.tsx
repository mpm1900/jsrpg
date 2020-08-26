import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { ProcessedPartyT, PartyT } from '../../types/Party'
import { usePartyContext } from '../PartyContext'
import { makeParty } from '../../objects/makeParty'
import { v4 } from 'uuid'
import { PC_PARTY_ID } from '../../state/parties'
import { useRollContext } from '../RollContext'
import {
  getCombatRecordBuilder,
  CombatRoundT,
  ENEMY_PARTY_ID,
  logResult,
  checkParty,
} from './util'
import { CharacterT, processCharacter } from '../../types/Character'
import { useCombatLogContext } from '../CombatLogContext'

export interface CombatContextT {
  rounds: any[]
  userParty: ProcessedPartyT
  rawUserParty: PartyT
  enemyParty: ProcessedPartyT
  rawEnemyParty: PartyT
  parties: ProcessedPartyT[]
  running: boolean
  done: boolean
  log: React.ReactNode[]
  setAction: (characterId: string, actionId: string) => void
  start: () => void
  stop: () => void
  reset: () => void
}
const defaultContextValue: CombatContextT = {
  rounds: [],
  userParty: { id: v4(), characters: [], processed: true, items: [] },
  rawUserParty: { id: v4(), characters: [], items: [] },
  enemyParty: { id: v4(), characters: [], processed: true, items: [] },
  rawEnemyParty: { id: v4(), characters: [], items: [] },
  parties: [],
  running: false,
  done: false,
  log: [],
  setAction: (characterId, actionId) => {},
  start: () => {},
  stop: () => {},
  reset: () => {},
}
export const CombatContext = createContext<CombatContextT>(defaultContextValue)
export const useCombatContext = () => useContext(CombatContext)

export interface CombatContextProviderPropsT {
  children: React.ReactNode | React.ReactNode[]
}
export const CombatContextProvider = (props: CombatContextProviderPropsT) => {
  const { children } = props
  const {
    parties,
    rawParties,
    userParty,
    rawUserParty,
    upsertParty,
    updateCharacter,
  } = usePartyContext()
  const { checkCharacter, basicRollCharacter } = useRollContext()
  const { lines, addLine } = useCombatLogContext()
  const [rounds, setRounds] = useState<CombatRoundT[]>([])
  const [running, setRunning] = useState<boolean>(false)
  const [done, setDone] = useState(false)
  const [lastRoundId, setLastRoundId] = useState<string>('')
  const rawEnemyParty = rawParties.filter((p) => p.id === ENEMY_PARTY_ID)[0]
  const enemyParty = parties.filter((p) => p.id === ENEMY_PARTY_ID)[0]

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const start = () => {
    if (!enemyParty || !userParty) return
    if (intervalRef.current === null) {
      setRunning(true)
      intervalRef.current = setInterval(() => {
        const builder = getCombatRecordBuilder(
          checkCharacter,
          basicRollCharacter,
        )
        console.log('ROUND', rounds.length + 1)
        const round = builder(userParty, enemyParty, rawParties)
        setRounds((r) => [...r, round])
      }, 1000)
    }
  }
  const stop = () => {
    if (intervalRef.current !== null) {
      setRunning(false)
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }
  const reset = (log: boolean = true) => {
    if (log)
      addLine(<strong style={{ color: 'turquoise' }}>Combat: {v4()}</strong>)
    setDone(false)
    setRounds([])
    setLastRoundId('')
    upsertParty(makeParty(ENEMY_PARTY_ID))
    upsertParty({
      ...rawUserParty,
      characters: rawUserParty.characters.map((c) => ({
        ...c,
        partyId: PC_PARTY_ID,
        dead: false,
        healthOffset: 0,
      })),
    })
  }

  useEffect(() => {
    reset()
    return () => {
      stop()
      reset(false)
    }
  }, [])

  const finish = (text: string) => {
    alert(text)
    stop()
    setDone(true)
  }

  useEffect(() => {
    if (checkParty(userParty) && !done) {
      setTimeout(() => finish('YOU DIED'), 50)
    }
  }, [userParty])

  useEffect(() => {
    if (checkParty(enemyParty) && !done) {
      setTimeout(() => finish('YOU WIN!'), 50)
    }
  }, [enemyParty])

  useEffect(() => {
    if (rounds.length === 0) return
    if (!rawUserParty || !rawEnemyParty) return
    let rawCharacters = [
      ...rawUserParty.characters,
      ...rawEnemyParty.characters,
    ]
    const getCharacters = () => rawCharacters.map((c) => processCharacter(c))
    const localUpdate = (character: CharacterT) => {
      rawCharacters = rawCharacters.map((c) =>
        c.id === character.id ? character : c,
      )
    }
    const round = rounds[rounds.length - 1]
    addLine(
      <span style={{ color: 'lightblue' }}>{`ROUND ${rounds.length}`}</span>,
    )
    Object.values(round)
      .sort((a, b) => a.index - b.index)
      .forEach((attackResult) => {
        const characters = getCharacters()
        const source = characters.find((c) => c.id === attackResult.sourceId)
        const target = characters.find((c) => c.id === attackResult.targetId)
        const rawTarget = rawCharacters.find(
          (c) => c.id === attackResult.targetId,
        )
        if (!source || !rawTarget || !target) return
        if (!source.dead && !target.dead) {
          logResult(attackResult, source, target, addLine)
          const healthOffset = rawTarget.healthOffset + attackResult.totalDamage
          localUpdate({
            ...rawTarget,
            dead: healthOffset >= target.stats.health,
            healthOffset,
          })
        }
      })
    rawCharacters.forEach((c) => updateCharacter(c, c.partyId))
    stop()
    setLastRoundId(v4())
  }, [rounds])

  useEffect(() => {
    if (lastRoundId) start()
  }, [lastRoundId])

  return (
    <CombatContext.Provider
      value={{
        rounds,
        userParty,
        rawUserParty,
        enemyParty,
        rawEnemyParty,
        parties,
        running,
        done,
        log: lines,
        setAction: (characterId, actionId) => {},
        start,
        stop,
        reset,
      }}
    >
      {children}
    </CombatContext.Provider>
  )
}
