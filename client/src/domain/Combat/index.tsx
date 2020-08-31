import React, { useEffect, useMemo } from 'react'
import { useCombatContext } from '../../contexts/CombatContext'
import { FlexContainer, FullContainer } from '../../elements/flex'
import { CombatParty } from '../../components/CombatParty'
import { useUIContext } from '../../contexts/UIContext'
import { useEvent } from '../../hooks/useEvent'
import { BoxContainer, BoxButton } from '../../elements/box'
import BG from '../../assets/img/23761.jpg'
import { CombatCharacterTargets } from '../../components/CombatCharacterTargets'

export const Combat = () => {
  const {
    rawUserParty,
    rawEnemyParty,
    done,
    rounds,
    characterTargets,
    setCharacterTarget,
    next,
  } = useCombatContext()
  const { setLogKey } = useUIContext()
  const targetId = useMemo(() => {
    let _targetId: string | undefined =
      characterTargets[rawUserParty.characters[0].id]
    if (
      rawUserParty.characters.every((c) => {
        return characterTargets[c.id] === _targetId
      })
    ) {
      return _targetId
    }
    return undefined
  }, [characterTargets])

  const setAllIds = (tid?: string) => {
    rawUserParty.characters.forEach((c) => {
      setCharacterTarget(c.id, tid)
    })
  }

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
      <BoxContainer
        substyle={{
          height: 50,
          display: 'flex',
          alignItems: 'center',
          padding: '0px 8px',
        }}
      >
        <FullContainer>
          <FlexContainer>
            {!done && (
              <BoxButton onClick={() => next()} substyle={{ padding: 8 }}>
                Next Round
              </BoxButton>
            )}
          </FlexContainer>
          <FullContainer />
        </FullContainer>
        <FlexContainer
          style={{
            textTransform: 'uppercase',
            fontFamily: 'monospace',
            fontWeight: 'bolder',
            fontSize: 24,
          }}
        >
          Round {rounds.length + 1}
        </FlexContainer>
        <FullContainer style={{ display: 'flex' }}>
          <FullContainer />
          <FlexContainer style={{ alignItems: 'center' }}>
            <span
              style={{
                fontFamily: 'monospace',
                color: 'rgba(255,255,255,0.4)',
                fontWeight: 'bold',
                marginRight: 10,
              }}
            >
              ALL TARGET
            </span>
            <CombatCharacterTargets
              activeTargetId={targetId}
              onClick={(targetId) => {
                setAllIds(targetId)
              }}
            />
          </FlexContainer>
        </FullContainer>
      </BoxContainer>
      <FlexContainer id='Combat' $full style={{ padding: 10 }}>
        <CombatParty party={rawUserParty} />
        <FlexContainer $full $direction='column'></FlexContainer>
        <CombatParty party={rawEnemyParty} />
      </FlexContainer>
    </FlexContainer>
  )
}
