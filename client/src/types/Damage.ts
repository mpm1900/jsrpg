import { getKeys } from '../util/getKeys'
import { CharacterRollT, Roll2ResultT } from './Roll2'
import { RollCheckerT } from '../contexts/RollContext'

export type DamageElementTypeT = 'fire' | 'blood' | 'light' | 'dark'
export type DamageTypeKeyT = DamageElementTypeT | 'slashing' | 'piercing'

type _DamageTypeRollsT = Record<DamageTypeKeyT, CharacterRollT | undefined>
export type DamageTypeRollsT = Partial<_DamageTypeRollsT>
type _DamageTypeResultsT = Record<DamageTypeKeyT, Roll2ResultT | undefined>
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

export const rollDamage = (
  resolveRoll: RollCheckerT<CharacterRollT, Roll2ResultT>,
) => (
  rolls: DamageTypeRollsT,
  crit: boolean = false,
  label?: string,
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
    const roll = rolls[key] as CharacterRollT
    let result = resolveRoll(roll, true, false, label)
    if (crit) {
      result = {
        ...result,
        total: result.maxTotal || result.total,
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
