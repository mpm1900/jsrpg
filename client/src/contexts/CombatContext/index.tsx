import React, { createContext, useContext, useEffect, useState } from 'react'
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
  checkParty,
  resolveRound,
} from './util'
import { useCombatLogContext } from '../CombatLogContext'
import { useInterval } from '../../hooks/useInterval'
import { useModalContext } from '../ModalContext'

export interface CombatContextT {
  rounds: any[]
  userParty: ProcessedPartyT
  rawUserParty: PartyT
  enemyParty: ProcessedPartyT
  rawEnemyParty: PartyT
  parties: ProcessedPartyT[]
  running: boolean
  done: boolean
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
    upsertCharacter,
  } = usePartyContext()
  const { checkCharacter, basicRollCharacter } = useRollContext()
  const { addLine } = useCombatLogContext()
  const [rounds, setRounds] = useState<CombatRoundT[]>([])
  const [done, setDone] = useState(false)
  const rawEnemyParty = rawParties.filter((p) => p.id === ENEMY_PARTY_ID)[0]
  const enemyParty = parties.filter((p) => p.id === ENEMY_PARTY_ID)[0]
  const { open } = useModalContext()

  const { start, stop, running } = useInterval(() => {
    if (!enemyParty || !userParty) return
    const builder = getCombatRecordBuilder(checkCharacter, basicRollCharacter)
    const round = builder(userParty, enemyParty, rawParties)
    setRounds((r) => [...r, round])
  })

  const reset = (log: boolean = true) => {
    if (log) {
      addLine(<strong style={{ color: 'turquoise' }}>Combat: {v4()}</strong>)
    }
    setDone(false)
    setRounds([])
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
    upsertParty(makeParty(ENEMY_PARTY_ID))
    upsertParty({
      ...rawUserParty,
      characters: rawUserParty.characters.map((c) => ({
        ...c,
        partyId: PC_PARTY_ID,
      })),
    })
    return () => {
      stop()
      reset(false)
    }
  }, [])

  const finish = (text: string) => {
    stop()
    setDone(true)
    open(() => <h1>{text}</h1>)
  }

  useEffect(() => {
    if (checkParty(userParty) && !done) {
      finish('YOU DIED')
    }
  }, [userParty])

  useEffect(() => {
    if (checkParty(enemyParty) && !done) {
      finish('YOU WIN!')
    }
  }, [enemyParty])

  useEffect(() => {
    if (rounds.length > 0) {
      resolveRound(
        rounds,
        rawUserParty,
        rawEnemyParty,
        addLine,
        upsertCharacter,
      )
      if (running) {
        start()
      }
    }
  }, [rounds])

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
