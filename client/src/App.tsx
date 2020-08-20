import React from 'react'
import { CharacterStateContextProvider } from './contexts/CharacterContext'
import { RollStateContextProvider } from './contexts/RollContext'
import { Character } from './domain'
import { FlexContainer } from './elements/flex'
import { ApplicationLog } from './components/ApplicationLog'
import { AttackContextProvider } from './contexts/AttackContext'
import { BoxContainer } from './elements/box'

export const App = () => {
  return (
    <div
      className='App'
      style={{ height: '100%', width: '100%', display: 'flex' }}
    >
      <CharacterStateContextProvider characterId='base'>
        <RollStateContextProvider>
          <AttackContextProvider>
            <FlexContainer $full $direction='column'>
              <BoxContainer
                substyle={{
                  height: 64,
                  padding: 0,
                  alignItems: 'center',
                  display: 'flex',
                }}
              >
                <div
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 24,
                    marginLeft: 30,
                  }}
                >
                  rpgjs
                </div>
              </BoxContainer>
              <FlexContainer $full>
                <Character />
                <ApplicationLog />
              </FlexContainer>
            </FlexContainer>
          </AttackContextProvider>
        </RollStateContextProvider>
      </CharacterStateContextProvider>
    </div>
  )
}
