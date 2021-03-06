import React, { useContext, useMemo } from 'react'
import {
  CharacterT,
  ProcessedCharacterT,
  processCharacter,
} from '../../types/Character'
import { BASE_CHARACTER } from '../../objects/baseCharacter'
import { usePartyContext } from '../PartyContext'
import { RollStateContextProvider } from '../RollContext'

export interface CharacterContextT {
  character: ProcessedCharacterT
  rawCharacter: CharacterT
  onChange: (character: CharacterT) => void
}
export const CharacterContext = React.createContext<CharacterContextT>({
  rawCharacter: BASE_CHARACTER,
  character: processCharacter(BASE_CHARACTER),
  onChange: (character) => {},
})
export const useCharacterContext = () => useContext(CharacterContext)

export interface CharacterContextProviderT {
  children: any
  character: CharacterT
  onChange: (character: CharacterT) => void
}
export const CharacterContextProvider = (props: CharacterContextProviderT) => {
  const { character, children, onChange } = props
  const processedCharacter: ProcessedCharacterT = useMemo(
    () => processCharacter(character),
    [character],
  )
  return (
    <CharacterContext.Provider
      value={{
        character: processedCharacter,
        rawCharacter: character,
        onChange,
      }}
    >
      <RollStateContextProvider>{children}</RollStateContextProvider>
    </CharacterContext.Provider>
  )
}

export interface CharacterStateContextProviderPropsT {
  children: any
  characterId?: string
}
export const CharacterStateContextProvider = (
  props: CharacterStateContextProviderPropsT,
) => {
  const { children, characterId } = props
  const { activeCharacterId, rawUserParty, upsertCharacter } = usePartyContext()
  const character =
    rawUserParty.characters.find((c) => c.id === characterId) ||
    rawUserParty.characters.find((c) => c.id === activeCharacterId) ||
    BASE_CHARACTER
  const onChange = (character: CharacterT) => {
    if (!character) return
    if ((character as ProcessedCharacterT).processed) {
      throw new Error('no process characters allowed')
    }
    upsertCharacter(character)
  }
  return (
    <CharacterContextProvider
      character={character as CharacterT}
      onChange={onChange}
    >
      {children}
    </CharacterContextProvider>
  )
}
