import { DiceRoll } from 'rpg-dice-roller'
import { getSign } from '../util/getSign'
import { v4 } from 'uuid'
import {
  CharacterSkillCheckKeyT,
  ProcessedCharacterT,
  getModifierValueFromKeys,
  CharacterKeyMap3,
} from './Character'
import { getKeys } from '../util/getKeys'
import { noneg } from '../util/noneg'

export const THREE_D6_DIST: any = {
  3: 0.46,
  4: 1.85,
  5: 4.62,
  6: 9.25,
  7: 16.2,
  8: 25.92,
  9: 37.5,
  10: 50.0,
  11: 62.5,
  12: 74.07,
  13: 83.79,
  14: 90.74,
  15: 95.37,
  16: 98.14,
  17: 99.53,
}
export const get3d6Probability = (result: number) => {
  if (result < 3) return 0.46
  if (result > 17) return 99.53
  return THREE_D6_DIST[result]
}

interface ProcessedRollT {
  n: number
  d: number
}
const processRollString = (rollString: string): ProcessedRollT[] => {
  const rolls = rollString.split('+')
  return rolls.map((roll) => {
    const [n, d] = roll.split('d')
    return { n: parseInt(n, 10), d: parseInt(d, 10) }
  })
}

export interface Roll2T {
  string: string
  modifier: number
}
export interface Check2T {
  value: number
  roll: Roll2T
}
export interface Roll2ResultT {
  id: string
  label?: string
  total: number
  output: string
  criticalSuccess: boolean
  criticalFailure: boolean
  minTotal: number
  maxTotal: number
  averageTotal: number
}
export interface Check2ResultT extends Roll2ResultT {
  result: boolean
  chance: number
  goal: number
}
export interface CharacterRollT extends Roll2T {
  keys: CharacterSkillCheckKeyT[]
}
export interface CharacterCheckT extends Check2T {
  keys: CharacterSkillCheckKeyT[]
}

const getModifierString = (modifier: number) => {
  if (modifier === 0) return ''
  return `${getSign(modifier)}${Math.abs(modifier)}`
}
export const resolveRoll = (
  roll: Roll2T,
  allowNegatives: boolean = true,
): Roll2ResultT => {
  const string = combineRollStrings(roll.string) || '1d1-1'
  const result = new DiceRoll(`${string}${getModifierString(roll.modifier)}`)
  return {
    id: v4(),
    total: allowNegatives ? result.total : noneg(result.total),
    output: result.output,
    criticalSuccess: result.total === result.minTotal,
    criticalFailure: result.total === result.maxTotal,
    minTotal: allowNegatives ? result.minTotal : noneg(result.minTotal),
    maxTotal: allowNegatives ? result.maxTotal : noneg(result.maxTotal),
    averageTotal: allowNegatives
      ? result.averageTotal
      : noneg(result.averageTotal),
  }
}
export const quickRoll = (str: string, mod?: number): number =>
  resolveRoll({ string: str, modifier: mod || 0 }).total

export const getCheckProbability = (check: Check2T): number => {
  const { value, roll } = check
  if (roll.string === '3d6' && roll.modifier === 0)
    return get3d6Probability(value)
  if (roll.string === '') {
    return roll.modifier <= value ? 100 : 0
  }
  return 0
}

export const resolveCheck = (
  check: Check2T,
  allowNegatives?: boolean,
): Check2ResultT => {
  const { value, roll } = check
  const rollResult = resolveRoll(roll, allowNegatives)
  return {
    ...rollResult,
    result: rollResult.total <= value,
    chance: getCheckProbability(check),
    goal: value,
  }
}

export const ZERO_ROLL: Roll2T = {
  string: '',
  modifier: 0,
}
export const THREE_D6: Roll2T = {
  string: '3d6',
  modifier: 0,
}
export const ZERO_CHECK: Check2T = {
  value: 0,
  roll: ZERO_ROLL,
}
export const makeRoll = (str?: string, mod?: number): Roll2T => ({
  string: str || ZERO_ROLL.string,
  modifier: mod || ZERO_ROLL.modifier,
})
export const makeCheck = (
  value: number,
  str?: string,
  mod?: number,
): Check2T => ({
  value,
  roll: {
    string: str || THREE_D6.string,
    modifier: mod || THREE_D6.modifier,
  },
})
export const makeCharacterRoll = (
  keys: CharacterSkillCheckKeyT[],
  str?: string,
  mod?: number,
): CharacterRollT => ({
  keys,
  string: str || ZERO_ROLL.string,
  modifier: mod || ZERO_ROLL.modifier,
})
export const makeCharacterCheck = (
  keys: CharacterSkillCheckKeyT[],
  str?: string,
  mod?: number,
  value?: number,
): CharacterCheckT => ({
  keys,
  value: value || ZERO_CHECK.value,
  roll: {
    string: str === undefined ? THREE_D6.string : str,
    modifier: mod || THREE_D6.modifier,
  },
})
export const makeStandardCharacterCheck = (
  keys: CharacterSkillCheckKeyT[],
  modifier: number = 0,
) => makeCharacterCheck(keys, undefined, undefined, modifier)
export const combineRollStrings = (...rolls: string[]): string => {
  const list = rolls
    .filter((r) => r !== '')
    .map((r) => processRollString(r))
    .reduce((p, c) => [...p, ...c], [])
  let result: Record<number, number> = {}
  list.forEach((pRoll) => {
    result[pRoll.d] = (result[pRoll.d] || 0) + pRoll.n
  })
  return getKeys(result)
    .map((d, i) => {
      return `${result[parseInt(d, 10)]}d${d}`
    })
    .reduce((p, c, i) => `${p}${i > 0 ? '+' : ''}${c}`, '')
}
export const combineRolls = (...rolls: Roll2T[]): Roll2T => {
  return rolls.reduce(
    (p, c) => ({
      string: combineRollStrings(p.string, c.string),
      modifier: p.modifier + c.modifier,
    }),
    ZERO_ROLL,
  )
}
export const combineChecks = (...checks: Check2T[]): Check2T => {
  return checks.reduce((p, c) => ({
    value: p.value + c.value,
    roll: combineRolls(p.roll, c.roll),
  }))
}
export const combineCharacterRolls = (
  ...rolls: CharacterRollT[]
): CharacterRollT => {
  return rolls.reduce(
    (p, c) => ({
      ...combineRolls(p, c),
      keys: [...p.keys, ...c.keys],
    }),
    makeCharacterRoll([]),
  )
}
export const reduceCharacterRoll = (
  roll: CharacterRollT,
  character: ProcessedCharacterT,
): Roll2T => {
  const keyValue = getModifierValueFromKeys(character)(roll.keys || [])
  return {
    string: roll.string,
    modifier: roll.modifier + keyValue,
  }
}
export const reduceCharacterCheck = (
  check: CharacterCheckT,
  character: ProcessedCharacterT,
): Check2T => {
  const keyValue = getModifierValueFromKeys(character)(check.keys)
  return {
    value: check.value + keyValue,
    roll: check.roll,
  }
}
export const resolveCharacterRoll = (
  roll: CharacterRollT,
  character: ProcessedCharacterT,
  allowNegatives?: boolean,
) => {
  return resolveRoll(reduceCharacterRoll(roll, character), allowNegatives)
}
export const resolveCharacterCheck = (
  check: CharacterCheckT,
  character: ProcessedCharacterT,
  allowNegatives?: boolean,
) => {
  return resolveCheck(reduceCharacterCheck(check, character), allowNegatives)
}

// utils
export const getRollRange = (roll: Roll2T): string => {
  const result = resolveRoll(roll, false)
  if (result.minTotal === result.maxTotal) return `${result.maxTotal}`
  return `${result.minTotal}-${result.maxTotal}`
}
export const getRollText = (roll: CharacterRollT) => {
  const hasKeys = roll.keys.length > 0
  const hasMod = roll.modifier !== 0
  const keyString = roll.keys.reduce((p, c, i) => {
    const plus = i === 0 && !roll.string ? '' : '+'
    return `${p}${plus}${CharacterKeyMap3[c]}`
  }, '')
  const modString = hasMod
    ? `${roll.string || keyString ? getSign(roll.modifier) : ''}${Math.abs(
        roll.modifier,
      )}`
    : ''
  return `${roll.string}${keyString}${modString}`
}
