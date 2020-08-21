import React from 'react'
import {
  BattleContextProvider,
  useBattleContext,
} from '../../contexts/BattleContext'
import { FlexContainer } from '../../elements/flex'
import { CharacterDetails } from '../../components/CharacterDetails'
import { CharacterContextProvider } from '../../contexts/CharacterContext'
import { useAttackContext } from '../../contexts/AttackContext'

const BattleInternal = () => {
  const { rawCharacters, updateCharacter, attack } = useBattleContext()
  const { addAttackResult } = useAttackContext()
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
          <FlexContainer $full />
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
              addAttackResult(attack(enemy.id, character.id))
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
