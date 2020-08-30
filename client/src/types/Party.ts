import { CharacterT, ProcessedCharacterT, processCharacter } from './Character'
import { ItemT, EquippableT } from './Item'
import { SkillT } from './Skill'

export interface PartyT {
  id: string
  items: EquippableT[]
  characters: CharacterT[]
  skills: SkillT[]
}
export interface ProcessedPartyT {
  id: string
  items: EquippableT[]
  characters: ProcessedCharacterT[]
  skills: SkillT[]
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
