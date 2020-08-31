import React from 'react'
import { Roll2ResultT, Check2ResultT } from '../../types/Roll2'
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
