import React, { useEffect } from 'react'
import { useCombatContext } from '../../contexts/CombatContext'
import { FlexContainer, FullContainer } from '../../elements/flex'
import { CombatParty } from '../../components/CombatParty'
import { useUIContext } from '../../contexts/UIContext'
import { useEvent } from '../../hooks/useEvent'
import { BoxContainer } from '../../elements/box'

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

  return (
    <FlexContainer $full $direction='column'>
      <BoxContainer>
        <FlexContainer>
          <FullContainer />
          <div>
            {done && <button onClick={() => reset()}>Reset</button>}
            {!done && <button onClick={() => next()}>Next</button>}
          </div>
        </FlexContainer>
      </BoxContainer>
      <FlexContainer id='Combat' $full style={{ padding: 10 }}>
        <CombatParty party={rawUserParty} />
        <FlexContainer $full $direction='column'></FlexContainer>
        <CombatParty party={rawEnemyParty} />
      </FlexContainer>
    </FlexContainer>
  )
}
