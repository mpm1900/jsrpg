import { CharacterT, ProcessedCharacterT, processCharacter } from './Character'
import { ItemT, EquippableT } from './Item'
import { SkillT } from './Skill'
import { WeaponModT } from './Weapon'

export interface PartyT {
  id: string
  items: EquippableT[]
  characters: CharacterT[]
  skills: SkillT[]
  mods: WeaponModT[]
}
export interface ProcessedPartyT {
  id: string
  items: EquippableT[]
  characters: ProcessedCharacterT[]
  skills: SkillT[]
  mods: WeaponModT[]
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
