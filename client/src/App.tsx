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
                    margin: '0 30px',
                  }}
                >
                  rpgjs
                </div>
                <BoxContainer
                  tag='a'
                  href='google.com'
                  style={{
                    height: '100%',
                  }}
                  substyle={{
                    padding: '0 20px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#111',
                    boxShadow: 'inset 0 0 3px black',
                  }}
                >
                  character
                </BoxContainer>
                <BoxContainer
                  tag='a'
                  href='google.com'
                  style={{
                    height: '100%',
                  }}
                  substyle={{
                    padding: '0 20px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#333',
                  }}
                >
                  battle
                </BoxContainer>
              </BoxContainer>
              <FlexContainer $full style={{ overflow: 'auto' }}>
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
