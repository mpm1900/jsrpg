import React, { useRef, useEffect } from 'react'
import { FlexContainer } from '../../elements/flex'
import { useCombatLogContext } from '../../contexts/CombatLogContext'

export const AttackLog = () => {
  // const { attackResults, clear } = useAttackContext()
  const { lines, clear } = useCombatLogContext()
  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [lines])
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
          color: 'rgba(200,200,200, 1)',
          background: '#111',
          width: 380,
          overflowX: 'auto',
        }}
      >
        {lines.map((l, i) => (
          <pre key={i}>{l}</pre>
        ))}
        <div ref={scrollRef} />
      </FlexContainer>
    </FlexContainer>
  )
}
