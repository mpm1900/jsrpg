import React from 'react'
import { CharacterKeyMap3 } from '../../types/Character'
import { getSign } from '../../util/getSign'
import { getValueString } from '../../util/getValueString'
import { Roll2T, Check2T, Roll2ResultT, Check2ResultT } from '../../types/Roll2'
import { Span } from '../../contexts/CombatContext/log'

export const RollResult = (props: any) => {
  const roll: Roll2ResultT | Check2ResultT = props.roll
  const check = roll as Check2ResultT
  const isCheck = check.goal !== undefined
  const result = isCheck ? check.result : undefined
  return (
    <div style={{ fontFamily: 'monospace' }}>
      {isCheck && result && Span('lightgreen', '[PASSED] ')}
      {isCheck && !result && Span('lightcoral', '[FAILED] ')}
      {!isCheck && Span('turquoise', '[STATIC] ')}
      {isCheck && <span>({check.goal}) </span>}
      <span>{roll.output}</span>
    </div>
  )
}

const RollDescription = (props: any) => {
  const keys: any[] = props.keys
  const modifier = props.modifier
  const goal = props.goal
  const rollStr = props.rollStr
  const percentage = props.percentage
  const rollText = goal === null ? `${rollStr}+` : ''
  const keyText = keys.reduce((str, key, i) => `${str}${getSign(i)}${key}`, '')
  const modifierText = getSign(modifier) + getValueString(modifier)
  const percentageStr =
    goal === null
      ? ''
      : `: ${percentage === 100 ? ' ~' : ''}${percentage.toFixed(
          percentage === 100 ? 0 : percentage >= 10 ? 1 : 2,
        )}%`
  return <>{`(${rollText}${keyText}${modifierText}${percentageStr})`}</>
}

const RollStatus = (props: any) => {
  const { result } = props
  return (
    <>
      {'['}
      <span style={{ color: getColor(result) }}>{getText(result)}</span>
      {'] '}
    </>
  )
}

const getColor = (result: boolean | null) => {
  switch (result) {
    case true:
      return 'lightgreen'
    case false:
      return 'lightcoral'
    default:
      return '#4bebc6'
  }
}
const getText = (result: boolean | null) => {
  switch (result) {
    case true:
      return 'PASSED'
    case false:
      return 'FAILED'
    default:
      return 'STATIC'
  }
}
