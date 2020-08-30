import React, { useEffect } from 'react'
import { useCombatContext } from '../../contexts/CombatContext'
import { FlexContainer, FullContainer } from '../../elements/flex'
import { CombatParty } from '../../components/CombatParty'
import { useUIContext } from '../../contexts/UIContext'
import { useEvent } from '../../hooks/useEvent'
import { BoxContainer } from '../../elements/box'
import BG from '../../assets/img/23761.jpg'

export const Combat = () => {
  const {
    rawUserParty,
    rawEnemyParty,
    running,
    done,
    rounds,
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
    <FlexContainer
      $full
      $direction='column'
      style={{
        background: `url(${BG}) center center`,
        backgroundSize: 'cover',
      }}
    >
      <BoxContainer>
        <FlexContainer style={{ alignItems: 'center' }}>
          <div>{!done && <button onClick={() => next()}>Next</button>}</div>

          <FullContainer />
          <FlexContainer>Round {rounds.length + 1}</FlexContainer>
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
