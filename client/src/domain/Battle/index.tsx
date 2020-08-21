import React from 'react'
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
    pushAttack,
  } = useBattleContext()
  const character = rawCharacters[0]
  const enemy = rawCharacters[1]
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
            style={{ justifyContent: 'center', color: 'white' }}
          >
            <h1>Round {battle.rounds.length}</h1>
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
        <FlexContainer>
          <button
            onClick={() => {
              pushAttack(enemy.id, character.id)
            }}
          >
            Make Attack
          </button>
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
