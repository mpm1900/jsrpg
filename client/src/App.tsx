import React from 'react'
import { Switch } from 'react-router-dom'

import { CharacterStateContextProvider } from './contexts/CharacterContext'
import { RollStateContextProvider } from './contexts/RollContext'

import { Character } from './domain'

import { FlexContainer } from './elements/flex'
import { ApplicationLog } from './components/ApplicationLog'
import { makeRoute } from './routes'
import { PartyContextProvider } from './contexts/PartyContext'
import { AppSidebar } from './components/AppSidebar'
import { Combat } from './domain/Combat'
import { CombatContextProvider } from './contexts/CombatContext'
import { AppHeader } from './components/AppHeader'
import { CombatLogContextProvider } from './contexts/CombatLogContext'

export const App = () => {
  return (
    <div
      className='App'
      style={{ height: '100%', width: '100%', display: 'flex' }}
    >
      <PartyContextProvider>
        <CharacterStateContextProvider>
          <CombatLogContextProvider>
            <FlexContainer $full $direction='column'>
              <AppHeader />
              <FlexContainer $full style={{ height: 'calc(100% - 70px)' }}>
                <AppSidebar />
                <FlexContainer $full style={{ overflow: 'auto' }}>
                  <Switch>
                    {makeRoute('/battle', () => (
                      <CombatContextProvider>
                        <Combat />
                      </CombatContextProvider>
                    ))}
                    {makeRoute('/characters/:id', () => (
                      <Character />
                    ))}
                    {makeRoute('/', () => (
                      <Character />
                    ))}
                  </Switch>
                </FlexContainer>
                <ApplicationLog />
              </FlexContainer>
            </FlexContainer>
          </CombatLogContextProvider>
        </CharacterStateContextProvider>
      </PartyContextProvider>
    </div>
  )
}
