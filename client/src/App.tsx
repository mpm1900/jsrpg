import React, { useEffect } from 'react'
import { Switch } from 'react-router-dom'

import { CharacterStateContextProvider } from './contexts/CharacterContext'

import { Character } from './domain'

import { FlexContainer } from './elements/flex'
import { AppLog } from './components/ApplicationLog'
import { makeRoute } from './routes'
import { PartyContextProvider } from './contexts/PartyContext'
import { AppSidebar, MAIN_OPTIONS } from './components/AppSidebar'
import { Combat } from './domain/Combat'
import { CombatContextProvider } from './contexts/CombatContext'
import { AppHeader } from './components/AppHeader'
import { CombatLogContextProvider } from './contexts/CombatLogContext'
import { ModalContextProvider } from './contexts/ModalContext'
import { UIContextProvider } from './contexts/UIContext'

export const App = () => {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
      }}
    >
      <UIContextProvider>
        <ModalContextProvider>
          <PartyContextProvider>
            <CharacterStateContextProvider>
              <CombatLogContextProvider>
                <FlexContainer $full $direction='column'>
                  <AppHeader />
                  <FlexContainer
                    $full
                    style={{
                      height: 'calc(100% - 70px)',
                      width: '100vw',
                      overflow: 'auto',
                    }}
                  >
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
                    <AppLog />
                  </FlexContainer>
                </FlexContainer>
              </CombatLogContextProvider>
            </CharacterStateContextProvider>
          </PartyContextProvider>
        </ModalContextProvider>
      </UIContextProvider>
    </div>
  )
}
