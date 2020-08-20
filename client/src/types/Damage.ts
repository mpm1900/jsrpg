import { RollCheckT, RollResultT, considateRollChecks } from './Roll'
import { getKeys } from '../util/getKeys'

export type DamageElementTypeT = 'fire' | 'blood' | 'light' | 'dark'
export type DamageTypeKeyT = DamageElementTypeT | 'slashing' | 'piercing'

type _DamageTypeRollsT = Record<DamageTypeKeyT, RollCheckT | undefined>
export type DamageTypeRollsT = Partial<_DamageTypeRollsT>
type _DamageTypeResultsT = Record<DamageTypeKeyT, RollResultT | undefined>
export type DamageTypeResultsT = Partial<_DamageTypeResultsT>

export interface DamageRollsResultT {
  total: number
  rollResults: DamageTypeResultsT
}

export const DamageTypeKeyColors: Record<DamageTypeKeyT, string> = {
  slashing: 'grey',
  piercing: 'grey',
  fire: 'orange',
  blood: '#cd7474',
  light: 'lemonchiffon',
  dark: 'mediumpurple',
}

export const getDamageTypeKeys = (
  obj: DamageTypeRollsT | DamageTypeResultsT,
): DamageTypeKeyT[] => getKeys<DamageTypeKeyT>(obj)

export const rollDamage = (execRoll: (check: RollCheckT) => RollResultT) => (
  rolls: DamageTypeRollsT,
  crit: boolean = false,
): DamageRollsResultT => {
  let total = 0
  const keys: DamageTypeKeyT[] = getKeys(rolls).filter((key) => rolls[key])
  let rollResults: DamageTypeResultsT = {
    slashing: undefined,
    piercing: undefined,
    fire: undefined,
    blood: undefined,
    light: undefined,
    dark: undefined,
  }
  keys.forEach((key) => {
    const roll = rolls[key]
    let result = execRoll(roll as RollCheckT)
    if (crit) {
      result = {
        ...result,
        total: result.__roll.maxTotal || result.total,
      }
    }
    total += result.total
    rollResults = { ...rollResults, [key]: result }
  })
  return {
    total,
    rollResults,
  }
}

export const consolidateDamageRolls = (
  damageTypeRolls: DamageTypeRollsT,
): RollCheckT => {
  const keys: DamageTypeKeyT[] = getKeys<DamageTypeKeyT>(damageTypeRolls)
  const rolls = keys
    .filter((key) => damageTypeRolls[key])
    .map((key) => damageTypeRolls[key])

  return considateRollChecks(rolls as RollCheckT[])
}
