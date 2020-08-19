import React, { useContext, useState } from 'react'
import { useRollContext } from '../RollContext'
import { useCharacterContext } from '../CharacterContext'
import {
  rollDamage,
  DamageTypeKeyT,
  getDamageTypeKeys,
} from '../../types/Damage'
import { RollResultT, RollCheckT } from '../../types/Roll'
import { v4 } from 'uuid'

export interface AttackContextT {
  attackResults: AttackResultT[]
  runAttackRoll: () => AttackResultT
}
export const AttackContext = React.createContext<AttackContextT>({
  attackResults: [],
  runAttackRoll: () => ZERO_RESULT,
})
export const useAttackContext = () => useContext(AttackContext)

export interface AttackResultT {
  id: string
  hitSuccess: boolean
  criticalSuccess: boolean
  dodgeSuccess: boolean
  rawDamage: number
  blockedDamage: number
  totalDamage: number
}
export const ZERO_RESULT: AttackResultT = {
  id: 'zero',
  hitSuccess: false,
  criticalSuccess: false,
  dodgeSuccess: false,
  rawDamage: 0,
  blockedDamage: 0,
  totalDamage: 0,
}
export const DODGE_CHECK: RollCheckT = {
  keys: ['speed'],
}

export interface AttackContextProviderPropsT {
  children: React.ReactNode | React.ReactNode[]
}
export const AttackContextProvider = (props: AttackContextProviderPropsT) => {
  const { children } = props
  const { character } = useCharacterContext()
  const { execCheck, execRoll } = useRollContext()
  const [attackResults, setAttackResults] = useState<AttackResultT[]>([])

  const runAttackRoll = () => {
    const { weapon } = character
    let attackResult = { ...ZERO_RESULT, id: v4() }
    const hitResult = execCheck(weapon.accuracyCheck)
    if (hitResult.result) {
      attackResult.hitSuccess = true
      attackResult.criticalSuccess = hitResult.criticalSuccess
      const damageRoll = rollDamage(execRoll)(
        weapon.damageRolls,
        hitResult.criticalSuccess,
      )
      attackResult.rawDamage = damageRoll.total
      const dodgeRoll = execCheck(DODGE_CHECK)
      if (!dodgeRoll.result) {
        const damageResistances = character.damageResistances
        const keys: DamageTypeKeyT[] = getDamageTypeKeys(damageRoll.rollResults)
        keys
          .filter((key) => damageRoll.rollResults[key])
          .forEach((key) => {
            const result = damageRoll.rollResults[key] as RollResultT
            const resRoll = damageResistances[key] as RollCheckT
            const resRollResult = execRoll(resRoll, true, true)
            const damageTotal = result.total - resRollResult.total
            attackResult.blockedDamage +=
              result.total > 0 ? resRollResult.total : 0
            attackResult.totalDamage += damageTotal < 0 ? 0 : damageTotal
          })
      } else {
        attackResult.dodgeSuccess = true
      }
    }
    setAttackResults((ar) => [...ar, attackResult])
    return attackResult
  }
  return (
    <AttackContext.Provider
      value={{
        attackResults,
        runAttackRoll,
      }}
    >
      {children}
    </AttackContext.Provider>
  )
}
