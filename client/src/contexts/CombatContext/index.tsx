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
  checkCharacterActiveSkills,
  checkCharacterActiveTargets,
} from './util'
import { useCombatLogContext } from '../CombatLogContext'
import { useInterval } from '../../hooks/useInterval'
import { useModalContext } from '../ModalContext'
import { useHistory } from 'react-router'
import { CombatVictoryModal } from '../../components/CombatVictoryModal'
import { CombatLossModal } from '../../components/CombatLossModal'

export interface CombatContextT {
  rounds: any[]
  userParty: ProcessedPartyT
  rawUserParty: PartyT
  enemyParty: ProcessedPartyT
  rawEnemyParty: PartyT
  parties: ProcessedPartyT[]
  running: boolean
  done: boolean
  characterSkills: { [characterId: string]: string | undefined }
  characterTargets: { [characterId: string]: string | undefined }
  setCharacterSkill: (characterId: string, skillId?: string) => void
  setCharacterTarget: (characterId: string, targetId?: string) => void
  next: () => void
  start: () => void
  stop: () => void
  reset: (done: boolean) => void
}
const defaultContextValue: CombatContextT = {
  rounds: [],
  userParty: {
    id: v4(),
    characters: [],
    processed: true,
    items: [],
    skills: [],
    mods: [],
  },
  rawUserParty: { id: v4(), characters: [], items: [], skills: [], mods: [] },
  enemyParty: {
    id: v4(),
    characters: [],
    processed: true,
    items: [],
    skills: [],
    mods: [],
  },
  rawEnemyParty: { id: v4(), characters: [], items: [], skills: [], mods: [] },
  parties: [],
  running: false,
  done: false,
  characterSkills: {},
  characterTargets: {},
  setCharacterSkill: (characterId, skillId) => {},
  setCharacterTarget: (characterId, targetId) => {},
  next: () => {},
  start: () => {},
  stop: () => {},
  reset: (done: boolean) => {},
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
    upsertItem,
  } = usePartyContext()
  const { checkCharacter, rollCharacter } = useRollContext()
  const { addLine, clear } = useCombatLogContext()
  const [rounds, setRounds] = useState<CombatRoundT[]>([])
  const [wins, setWins] = useState<number>(0)
  const [characterSkills, setCharacterSkills] = useState<{
    [characterId: string]: string | undefined
  }>({})
  const [characterTargets, setCharacterTargets] = useState<{
    [characterId: string]: string | undefined
  }>({})
  const setCharacterSkill = (
    characterId: string,
    skillId: string | undefined,
  ) => setCharacterSkills((skills) => ({ ...skills, [characterId]: skillId }))
  const setCharacterTarget = (characterId: string, targetId?: string) =>
    setCharacterTargets((targets) => ({ ...targets, [characterId]: targetId }))
  const [done, setDone] = useState(false)
  const rawEnemyParty = rawParties.filter((p) => p.id === ENEMY_PARTY_ID)[0]
  const enemyParty = parties.filter((p) => p.id === ENEMY_PARTY_ID)[0]
  const { open, setCallback } = useModalContext()
  const history = useHistory()

  const next = () => {
    if (!enemyParty || !userParty) return
    const builder = getCombatRecordBuilder(
      characterSkills,
      characterTargets,
      checkCharacter,
      rollCharacter,
    )
    const round = builder(userParty, enemyParty, rawParties)
    setRounds((r) => [...r, round])
  }

  const { start, stop, running } = useInterval(next)

  const reset = (done: boolean = false) => {
    clear()
    if (!done) {
      setDone(false)
      setRounds([])
      upsertParty(makeParty(ENEMY_PARTY_ID))
      upsertParty({
        ...rawUserParty,
        characters: rawUserParty.characters.map((c) => ({
          ...c,
          traits: [],
          partyId: PC_PARTY_ID,
          //dead: false,
          //healthOffset: 0,
          //focusOffset: 0,
        })),
      })
    }
  }

  useEffect(() => {
    upsertParty(makeParty(ENEMY_PARTY_ID))
    upsertParty({
      ...rawUserParty,
      characters: rawUserParty.characters.map((c) => ({
        ...c,
        partyId: PC_PARTY_ID,
        dead: false,
        healthOffset: 0,
        focusOffset: 0,
        traits: [],
      })),
    })
    return () => {
      stop()
      reset(true)
    }
  }, [])

  const finish = (didWin: boolean) => {
    stop()
    setDone(true)
    if (didWin) {
      open(() => <CombatVictoryModal reset={reset} />, {}, true)
      setCallback((item) => {
        upsertItem(item)
      })
    } else {
      open(() => <CombatLossModal wins={wins} />, {}, true)
    }
  }

  useEffect(() => {
    if (checkParty(userParty) && !done) {
      setCallback(() => {
        history.push('/characters')
      })
      finish(false)
    } else {
      if (checkParty(enemyParty) && !done) {
        setCallback(() => {})
        finish(true)
        setWins((w) => w + 1)
      } else {
        if (running) {
          start()
        }
      }
    }
  }, [userParty, enemyParty])

  useEffect(() => {
    if (rounds.length > 0) {
      const characters = resolveRound(
        rounds,
        rawUserParty,
        rawEnemyParty,
        addLine,
        upsertCharacter,
      )
      checkCharacterActiveSkills(characters, characterSkills, setCharacterSkill)
      checkCharacterActiveTargets(
        characters,
        characterTargets,
        setCharacterTarget,
      )
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
        characterSkills,
        characterTargets,
        setCharacterSkill,
        setCharacterTarget,
        start,
        stop,
        reset,
        next,
      }}
    >
      {children}
    </CombatContext.Provider>
  )
}
