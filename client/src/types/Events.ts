import { CharacterTraitT, CharacterT, ProcessedCharacterT } from './Character'

export type EventTypeT = 'onHit' | 'onCrit'
export type EventsT = Partial<Record<EventTypeT, CharacterTraitT[]>>
export const EventsTypeMap: Record<EventTypeT, string> = {
  onHit: 'on hit',
  onCrit: 'on crit',
}

export const checkEvent = (character: CharacterT) => (
  event: EventTypeT,
): CharacterTraitT[] | undefined => {
  if ((character as ProcessedCharacterT).processed) {
    throw new Error('No Processed Characters [checkEvent]')
  }
  const { weapon } = character
  if (!weapon) return undefined
  const traits = weapon.events[event]
  if (!traits) return undefined
  return traits
}
