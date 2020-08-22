import React, { useEffect } from 'react'
import {
  BattleContextProvider,
  useBattleContext,
} from '../../contexts/BattleContext'
import { FlexContainer } from '../../elements/flex'
import { CharacterDetails } from '../../components/CharacterDetails'
import { CharacterContextProvider } from '../../contexts/CharacterContext'

const BattleInternal = () => {
  const {
    rawCharacters,
    updateCharacter,
    battle,
    wins,
    pushAttack,
    reset,
  } = useBattleContext()
  const character = rawCharacters[0]
  const enemy = rawCharacters[1]
  useEffect(() => {
    reset()
  }, [])
  return (
    <FlexContainer style={{ margin: 10, flex: 1 }}>
      <FlexContainer $full $direction='column'>
        <FlexContainer>
          <div>
            <CharacterContextProvider
              character={character}
              onChange={updateCharacter}
            >
              <CharacterDetails />
            </CharacterContextProvider>
          </div>
          <FlexContainer
            $full
            $direction='column'
            style={{ justifyContent: 'center', color: 'white' }}
          >
            <h1>Round {battle.rounds.length}</h1>
            <h2>{wins} Wins</h2>
          </FlexContainer>
          <div>
            <CharacterContextProvider
              character={enemy}
              onChange={updateCharacter}
            >
              <CharacterDetails />
            </CharacterContextProvider>
          </div>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  )
}

export const Battle = () => (
  <BattleContextProvider>
    <BattleInternal />
  </BattleContextProvider>
)
