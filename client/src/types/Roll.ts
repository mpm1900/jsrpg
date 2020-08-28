import { DiceRoll } from 'rpg-dice-roller'
import { v4 } from 'uuid'
import { CharacterSkillCheckKeyT, CharacterKeyMap3 } from './Character'
import { getSign } from '../util/getSign'
import { getValueString } from '../util/getValueString'

export const rollProbs: any = {
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
  18: 100,
}

export interface RollCheckT {
  id?: string
  roll?: string | number
  value?: number
  keys?: CharacterSkillCheckKeyT[]
  modifiers?: number
  static?: boolean
}
export interface RollResultT {
  result: boolean | null
  total: number
  goal: number | null
  output: string
  criticalSuccess: boolean
  criticalFailure: boolean
  chance?: number
  __check: RollCheckT
  __roll: any
  __subroll: any
  _id: string
  _ts: number
}

export const execRoll = (roll: string | number, value: number): any => {
  return typeof roll === 'number'
    ? {
        total: roll,
        minTotal: null,
        maxTotal: null,
        averageTotal: null,
        notation: null,
        hasRolls: null,
        rolls: [],
        chance: value >= roll ? 100 : 0,
        output: roll.toString(),
      }
    : new DiceRoll(roll)
}

const getBase = () => ({
  _id: v4(),
  _ts: Date.now(),
})

export const rollCheck = (check: RollCheckT): RollResultT => {
  let subroll
  const goal = (check.value || 0) + (check.modifiers || 0)
  const roll = check.roll || '3d6'
  const result = execRoll(roll, goal)
  const criticalSuccess = result.total === result.minTotal
  const criticalFailure = result.total === result.maxTotal
  if (criticalSuccess) {
    subroll = execRoll(roll, goal)
  }
  if (criticalFailure) {
    subroll = execRoll(roll, goal)
  }
  return {
    ...getBase(),
    result: (goal >= result.total && !criticalFailure) || criticalSuccess,
    total: result.total,
    goal: goal,
    output: result.output,
    chance: (result as any).chance,
    criticalSuccess,
    criticalFailure,
    __check: check,
    __roll: result,
    __subroll: subroll,
  }
}
export const basicRoll = (
  check: RollCheckT,
  allowNegative: boolean = false,
): RollResultT => {
  const roll = check.roll || (check.static ? '1d1-1' : '3d6')
  const offset = (check.value || 0) + (check.modifiers || 0)
  const rollText = roll ? `${roll}+` : ''
  const result = execRoll(`${rollText}${offset}`, 0)
  return {
    ...getBase(),
    result: null,
    total: allowNegative ? result.total : result.total < 0 ? 0 : result.total,
    goal: null,
    output: result.output,
    criticalFailure: false,
    criticalSuccess: false,
    __check: check,
    __roll: result,
    __subroll: null,
  }
}

export const considateRollChecks = (checks: RollCheckT[]): RollCheckT => {
  return checks.reduce(
    (result, check) => {
      return {
        ...result,
        roll: result.roll
          ? result.roll +
            (check && check.roll ? `+${check.roll as string}` : '')
          : check.roll,
        value: (result.value || 0) + ((check || {}).value || 0),
        keys: [...(result.keys || []), ...((check || {}).keys || [])],
        modifiers: (result.modifiers || 0) + ((check || {}).modifiers || 0),
      }
    },
    {
      roll: '',
      value: 0,
      keys: [],
      modifiers: 0,
    },
  )
}

export const considateStaticRolls = (checks: RollCheckT[]): RollCheckT => {
  return checks.reduce(
    (result, check) => {
      return {
        ...result,
        roll: result.roll
          ? result.roll +
            (check && check.roll ? `+${check.roll as string}` : '')
          : check.roll,
        value: (result.value || 0) + ((check || {}).value || 0),
        keys: [...(result.keys || []), ...((check || {}).keys || [])],
        modifiers: (result.modifiers || 0) + ((check || {}).modifiers || 0),
      }
    },
    {
      roll: '',
      value: 0,
      keys: [],
      modifiers: 0,
    },
  )
}

export const getGoal = (check: RollCheckT): number => {
  return (check.value || 0) + (check.modifiers || 0)
}

export const getProbability = (check: RollCheckT): number => {
  if (check.roll && typeof check.roll === 'number') {
    const modifiers: number = check.modifiers || 0
    const roll: number = check.roll
    return modifiers >= roll ? 100 : 0
  }
  return rollProbs[getGoal(check)]
}

export const getRollText = (roll: RollCheckT): string => {
  const rollStr = roll.roll
  const rollKeys = ((roll.keys as any[]) || []).map(
    (k) => CharacterKeyMap3[k as CharacterSkillCheckKeyT],
  )
  const keyStr =
    rollKeys.length > 0
      ? rollKeys.reduce((str, key, i) => `${str}${getSign(i)}${key}`, '+')
      : ''
  const modifier = roll.value
    ? `${
        rollStr === '' && roll.value >= 0 && rollKeys.length === 0
          ? ''
          : getSign(roll.value)
      }${getValueString(roll.value)}`
    : ''
  return `${rollStr}${keyStr}${modifier}`
}

export const makeStaticRoll = (
  value: number,
  roll: string = '',
  modifiers: number = 0,
  keys: CharacterSkillCheckKeyT[] = [],
): RollCheckT => ({
  roll: `${roll}`,
  value,
  modifiers,
  keys,
  static: true,
})

export const getRollRange = (
  roll: RollCheckT,
  allowNegative: boolean = false,
  resolveRoll: (
    check: RollCheckT,
    allowNegative?: boolean,
  ) => RollResultT = basicRoll,
): string => {
  const result = resolveRoll(roll, allowNegative)
  const resultRoll = result.__roll as DiceRoll
  if (resultRoll.maxTotal === resultRoll.minTotal)
    return `${resultRoll.maxTotal}`
  return `${resultRoll.minTotal > 0 ? resultRoll.minTotal : 0}-${
    resultRoll.maxTotal
  }`
}
