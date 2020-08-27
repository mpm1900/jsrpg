import React, { useEffect } from 'react'
import { useCombatContext } from '../../contexts/CombatContext'
import { FlexContainer } from '../../elements/flex'
import { CombatParty } from '../../components/CombatParty'
import { useUIContext } from '../../contexts/UIContext'

export const Combat = () => {
  const {
    rawUserParty,
    rawEnemyParty,
    running,
    done,
    start,
    stop,
    reset,
  } = useCombatContext()
  const { setLogKey } = useUIContext()

  useEffect(() => {
    setLogKey('attack-log')
    return () => {
      setLogKey(undefined)
    }
  }, [])
  return (
    <FlexContainer id='Combat' $full style={{ padding: 10 }}>
      <CombatParty party={rawUserParty} />
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
      <CombatParty party={rawEnemyParty} />
    </FlexContainer>
  )
}
