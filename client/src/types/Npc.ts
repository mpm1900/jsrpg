import { CharacterT, ProcessedCharacterT } from './Character'

export interface NpcT extends CharacterT {
  npc: true
}
export interface ProcessedNpcT extends ProcessedCharacterT {
  npc: true
}

export interface PcT extends CharacterT {
  pc: true
}
export interface ProcessedPcT extends ProcessedCharacterT {
  pc: true
}
