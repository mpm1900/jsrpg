import React from 'react'
import { CharacterKeyMap3 } from '../../types/Character'
import { RollResultT, rollProbs } from '../../types/Roll'
import { getSign } from '../../util/getSign'
import { getValueString } from '../../util/getValueString'

export const RollResult = (props: any) => {
  const roll: RollResultT = props.roll
  const { __check } = roll
  const goal = roll.goal || 0
  const keys = __check.keys?.map((key) => CharacterKeyMap3[key])
  const modifier =
    roll.goal === null ? __check.value : goal - (__check.modifiers || 0)
  const percentage =
    typeof roll.chance !== 'undefined' ? roll.chance : rollProbs[goal] || 100
  return (
    <div>
      <span style={{ fontFamily: 'monospace' }}>
        <RollStatus result={roll.result} />
        <RollDescription
          keys={keys}
          modifier={modifier}
          goal={roll.goal}
          percentage={percentage}
          rollStr={__check.roll}
        />{' '}
        {roll.output} = {roll.total}
      </span>
      {roll.criticalSuccess && (
        <>
          <br />
          <span>Critical Hit!</span>
        </>
      )}
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
      return 'turquoise'
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
