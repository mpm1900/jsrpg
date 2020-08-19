import React from 'react'
import { CharacterStateContextProvider } from './contexts/CharacterContext'
import { RollStateContextProvider } from './contexts/RollContext'
import { Character } from './domain'
import { FlexContainer } from './elements/flex'
import { ApplicationLog } from './components/ApplicationLog'
import { AttackContextProvider } from './contexts/AttackContext'

export const App = () => {
  return (
    <div
      className='App'
      style={{ height: '100%', width: '100%', display: 'flex' }}
    >
      <CharacterStateContextProvider characterId='base'>
        <RollStateContextProvider>
          <AttackContextProvider>
            <FlexContainer $full>
              <Character />
            </FlexContainer>
            <ApplicationLog />
          </AttackContextProvider>
        </RollStateContextProvider>
      </CharacterStateContextProvider>
    </div>
  )
}
