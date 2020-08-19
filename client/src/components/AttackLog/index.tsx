import React from 'react'
import { useAttackContext } from '../../contexts/AttackContext'

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
  const { attackResults, runAttackRoll } = useAttackContext()
  return (
    <div style={{ overflow: 'auto', padding: 10, flex: 1 }}>
      <button onClick={runAttackRoll} style={{ marginBottom: 20 }}>
        Run Attack Roll
      </button>
      {attackResults.map((attackResult) => (
        <div key={attackResult.id} style={{ marginBottom: 10 }}>
          <pre>ATTACK</pre>
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
          <pre>
            {`  [`}
            {`RAW DAMAGE   \t= ${attackResult.rawDamage}`}
            {`] `}
          </pre>
          <pre>
            {`  [`}
            {`BLOCKED DAMAGE \t= ${attackResult.blockedDamage}`}
            {`] `}
          </pre>
          <pre>
            {`  [`}
            {`TOTAL DAMAGE \t= ${attackResult.totalDamage}`}
            {`] `}
          </pre>
        </div>
      ))}
    </div>
  )
}
