import React, { useEffect } from 'react'
import { useCombatContext } from '../../contexts/CombatContext'
import { FlexContainer } from '../../elements/flex'
import { CombatParty } from '../../components/CombatParty'
import { useUIContext } from '../../contexts/UIContext'
import { useEvent } from '../../hooks/useEvent'

export const Combat = () => {
  const {
    rawUserParty,
    rawEnemyParty,
    running,
    done,
    start,
    stop,
    reset,
    next,
  } = useCombatContext()
  const { setLogKey } = useUIContext()

  useEffect(() => {
    setLogKey('attack-log')
    return () => {
      setLogKey(undefined)
    }
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      console.log('next', e)
      next()
    }
    window.addEventListener('keydown', handler)
    return () => {
      window.removeEventListener('keydown', handler)
    }
  }, [next])
  return (
    <FlexContainer id='Combat' $full style={{ padding: 10 }}>
      <CombatParty party={rawUserParty} />
      <FlexContainer $full $direction='column'>
        <div>
          {done && <button onClick={() => reset()}>Reset</button>}
          {!done && <button onClick={() => next()}>Next</button>}
        </div>
      </FlexContainer>
      <CombatParty party={rawEnemyParty} />
    </FlexContainer>
  )
}
