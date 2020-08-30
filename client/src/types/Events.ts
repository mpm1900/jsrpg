import { CharacterTraitT, CharacterT, ProcessedCharacterT } from './Character'
import { SkillT } from './Skill'
import { getKeys } from '../util/getKeys'
import { reduce } from '../util/reduce'

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

const force = (traits?: CharacterTraitT[]) => traits || []
export const combineEvents = (...events: EventsT[]): EventsT => {
  return reduce<EventsT, EventsT>(
    events,
    (p, c) => {
      let ret: EventsT = {}
      getKeys(p).forEach((key) => {
        ret[key] = [...force(p[key]), ...force(c[key])]
      })
      return ret
    },
    {
      onHit: [],
      onCrit: [],
    },
  )
}
