import { CharacterTraitT, CharacterT, ProcessedCharacterT } from './Character'
import { SkillT } from './Skill'

export type EventTypeT = 'onHit' | 'onCrit'
export type EventsT = Partial<Record<EventTypeT, CharacterTraitT[]>>
export const EventsTypeMap: Record<EventTypeT, string> = {
  onHit: 'on hit',
  onCrit: 'on crit',
}

export const checkEvent = (character: CharacterT, skill: SkillT) => (
  event: EventTypeT,
): CharacterTraitT[] | undefined => {
  if ((character as ProcessedCharacterT).processed) {
    throw new Error('No Processed Characters [checkEvent]')
  }
  const skillTraits = skill.events[event]
  if (skill.combineWeaponDamage) {
    const { weapon } = character
    if (!weapon) return skillTraits
    const traits = weapon.events[event]
    if (!traits) return skillTraits
    return [...(skillTraits || []), ...traits]
  }
  return skillTraits
}
