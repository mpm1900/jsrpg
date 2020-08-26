import React from 'react'
import { useCombatContext } from '../../contexts/CombatContext'
import { FlexContainer } from '../../elements/flex'
import { CombatParty } from '../../components/CombatParty'

export const Combat = () => {
  const {
    userParty,
    enemyParty,
    running,
    done,
    start,
    stop,
    reset,
  } = useCombatContext()
  return (
    <FlexContainer id='Combat' $full style={{ padding: 10 }}>
      <CombatParty party={userParty} />
      <FlexContainer $full $direction='column'>
        <div>
          {!done &&
            (!running ? (
              <button onClick={() => start()}>Start</button>
            ) : (
              <button onClick={() => stop()}>Stop</button>
            ))}
          {done && <button onClick={() => reset()}>Reset</button>}
        </div>
      </FlexContainer>
      <CombatParty party={enemyParty} />
    </FlexContainer>
  )
}
