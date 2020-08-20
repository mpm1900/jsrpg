import {
  ProcessedCharacterT,
  checkCharacter,
  basicRollCharacter,
} from '../../types/Character'
import { RollCheckT, RollResultT } from '../../types/Roll'
import { ZERO_RESULT, AttackResultT } from '../AttackContext'
import { v4 } from 'uuid'
import { rollDamage, getDamageTypeKeys } from '../../types/Damage'
import { noneg } from '../../util/noneg'

export const DODGE_CHECK: RollCheckT = {
  keys: ['dexterity'],
  value: -8,
}

const formatRoll = (roll: RollCheckT): RollCheckT => ({
  ...roll,
  roll: roll.roll || '1d1-1',
})

export const execAttack = (characters: ProcessedCharacterT[]) => (
  targetId: string,
  sourceId: string,
): AttackResultT => {
  const target = characters.find((c) => c.id === targetId)
  const source = characters.find((c) => c.id === sourceId)
  let attackResult = { ...ZERO_RESULT, id: v4() }
  if (target && source) {
    const { weapon } = source
    const hitRoll = checkCharacter(source)(weapon?.accuracyCheck)
    if (hitRoll.result) {
      const criticalSuccess = hitRoll.criticalSuccess
      attackResult.hitSuccess = true
      attackResult.criticalSuccess = criticalSuccess
      const damageRoll = rollDamage(basicRollCharacter(source))(
        weapon.damageRolls,
        criticalSuccess,
      )
      attackResult.rawDamage = damageRoll.total
      const dodgeRoll = checkCharacter(target)(DODGE_CHECK)
      if (dodgeRoll.result) {
        attackResult.dodgeSuccess = true
      } else {
        const damageResistances = target.damageResistances
        const damageKeys = getDamageTypeKeys(damageRoll.rollResults).filter(
          (k) => damageRoll.rollResults[k],
        )
        damageKeys.forEach((key) => {
          const damageResult = damageRoll.rollResults[key] as RollResultT
          const resistanceCheck = damageResistances[key] as RollCheckT
          const resistanceRoll = basicRollCharacter(source)(
            formatRoll(resistanceCheck),
            true,
          )
          const damageTotal = damageResult.total - resistanceRoll.total
          attackResult.blockedDamage +=
            damageResult.total > 0 ? resistanceRoll.total : 0
          attackResult.totalDamage += noneg(damageTotal)
        })
      }
    }
  }
  return attackResult
}
