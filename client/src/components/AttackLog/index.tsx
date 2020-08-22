import React from 'react'
import { useAttackContext } from '../../contexts/AttackContext'
import { FlexContainer } from '../../elements/flex'

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
  const { attackResults, clear } = useAttackContext()
  return (
    <FlexContainer
      $direction='column'
      $full
      style={{ overflow: 'auto', padding: 10, overflowY: 'auto' }}
    >
      <button onClick={clear} style={{ marginBottom: 20 }}>
        Clear Log
      </button>
      {attackResults.map((attackResult) => (
        <div key={attackResult.id} style={{ marginBottom: 10 }}>
          <pre> {attackResult.label ? attackResult.label : 'ATTACK'}</pre>
          <pre>
            {`  [`}
            {attackResult.hitSuccess ? (
              <P text='HIT SUCCESS' />
            ) : (
              <F text='ATTACK MISSED' />
            )}
            {`] `}
          </pre>
          {attackResult.criticalSuccess && (
            <pre>
              {`  [`}
              <P text='CRITICAL HIT SUCCESS' />
              {`] `}
            </pre>
          )}
          {attackResult.dodgeSuccess && (
            <pre>
              {`  [`}
              <F text='DODGE SUCCESS' />
              {`] `}
            </pre>
          )}
          {attackResult.rawDamage > 0 && (
            <pre>
              {`  [`}
              {`DAMAGE:   \t ${attackResult.totalDamage} = ${attackResult.rawDamage} - ${attackResult.blockedDamage}`}
              {`] `}
            </pre>
          )}
        </div>
      ))}
    </FlexContainer>
  )
}
