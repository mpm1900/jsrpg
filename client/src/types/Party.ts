import { CharacterT, ProcessedCharacterT, processCharacter } from './Character'
import { ItemT } from './Item'

export interface PartyT {
  id: string
  items: ItemT[]
  characters: CharacterT[]
}
export interface ProcessedPartyT {
  id: string
  items: ItemT[]
  characters: ProcessedCharacterT[]
  processed: true
}

export const processParty = (party: PartyT): ProcessedPartyT => ({
  ...party,
  characters: party.characters.map((c) => ({
    ...processCharacter(c),
    partyId: party.id,
  })),
  processed: true,
})
