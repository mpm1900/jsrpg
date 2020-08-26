import React from 'react'
import { FlexContainer } from '../../elements/flex'
import { useCombatLogContext } from '../../contexts/CombatLogContext'

interface FPPropT {
  text?: string
}
const P = ({ text }: FPPropT) => (
  <span style={{ color: 'lightgreen' }}>{text}</span>
)
const F = ({ text }: FPPropT) => (
  <span style={{ color: 'lightcoral' }}>{text}</span>
)

export const AttackLog = () => {
  // const { attackResults, clear } = useAttackContext()
  const { lines, clear } = useCombatLogContext()
  return (
    <FlexContainer
      $direction='column'
      $full
      style={{ overflow: 'auto', padding: 10, overflowY: 'auto' }}
    >
      <button onClick={clear} style={{ marginBottom: 20 }}>
        Clear Log
      </button>
      <FlexContainer
        $direction='column'
        $full
        style={{
          color: 'white',
          background: '#111',
          width: 380,
          overflowX: 'auto',
        }}
      >
        {lines.map((l, i) => (
          <pre key={i}>{l}</pre>
        ))}
      </FlexContainer>
    </FlexContainer>
  )
}
