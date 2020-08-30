import { WeaponT, ProcessedWeaponT, processWeapon } from './Weapon'
import { EquippableT } from './Item'
import { FISTS } from '../objects/fists'
import { DamageTypeRollsT, getDamageTypeKeys, DamageTypeKeyT } from './Damage'
import { ArmorT } from './Armor'
import { reduce } from '../util/reduce'
import { v4 } from 'uuid'
import { noneg } from '../util/noneg'
import { makeTrait } from '../objects/util'
import {
  combineCharacterRolls,
  CharacterRollT,
  resolveCharacterCheck,
} from './Roll2'
import { SkillT } from './Skill'

export type CharacterAbilityKeyT =
  | 'strength'
  | 'dexterity'
  | 'intelligence'
  | 'vigor'
export type CharacterAbilitiesT = Record<CharacterAbilityKeyT, number>

export type CharacterStatKeyT =
  | 'health'
  | 'focus'
  | 'will'
  | 'perception'
  | 'agility'
  | 'accuracy'
  | 'evade'
export type CharacterStatsT = Record<CharacterStatKeyT, number>

export type CharacterResourceKeyT =
  | 'characterPoints'
  | 'weaponHands'
  | 'heads'
  | 'bodies'
  | 'hands'
  | 'fingers'
  | 'feet'
export type CharacterResourcesT = Record<CharacterResourceKeyT, number>

export type CharacterSkillCheckKeyT = CharacterAbilityKeyT | CharacterStatKeyT

export interface CharacterTraitT {
  id: string
  name: string
  healthOffset: number
  focusOffset: number
  abilitiesModifiers: CharacterAbilitiesT
  statsModifiers: CharacterStatsT
  duration: number
}

export interface CharacterT {
  name: string
  id: string
  power: number
  resources: CharacterResourcesT
  abilities: CharacterAbilitiesT
  damageResistances: DamageTypeRollsT
  traits: CharacterTraitT[]
  skills: SkillT[]

  equippedItems: EquippableT[]
  armor: ArmorT[]
  weapon?: WeaponT

  healthOffset: number
  focusOffset: number
  partyId?: string
  dead: boolean
  inspected: boolean
}
export interface ProcessedCharacterT extends CharacterT {
  stats: CharacterStatsT
  weapon: ProcessedWeaponT
  processed: true
}

export const getTraits = (character: CharacterT): CharacterTraitT[] => {
  const armorTraits: CharacterTraitT[] = reduce<ArmorT, CharacterTraitT[]>(
    character.armor,
    (result, item) => [...result, ...item.traits],
    [],
  )
  const equippedItemTraits: CharacterTraitT[] = reduce<
    EquippableT,
    CharacterTraitT[]
  >(character.equippedItems, (result, item) => [...result, ...item.traits], [])
  return [
    ...character.traits,
    ...processWeapon(character.weapon || FISTS).traits,
    ...equippedItemTraits,
    ...armorTraits,
  ]
}

export const getAbilities = (character: CharacterT): CharacterAbilitiesT => {
  return getTraits(character)
    .map((trait) => trait.abilitiesModifiers)
    .reduce(
      (result, cur) => ({
        strength: result.strength + cur.strength,
        dexterity: result.dexterity + cur.dexterity,
        intelligence: result.intelligence + cur.intelligence,
        vigor: result.vigor + cur.vigor,
      }),
      character.abilities,
    )
}

export const getStats = (character: CharacterT): CharacterStatsT => {
  const abilities = getAbilities(character)
  return getTraits(character)
    .map((trait) => trait.statsModifiers)
    .reduce(
      (result, cur) => ({
        health: result.health + cur.health,
        focus: result.focus + cur.focus,
        will: result.will + cur.will,
        perception: result.perception + cur.perception,
        agility: result.agility + cur.agility,
        accuracy: result.accuracy + cur.accuracy,
        evade: result.evade + cur.evade,
      }),
      {
        health: abilities.strength * 2 + abilities.vigor,
        focus: abilities.intelligence + abilities.vigor,
        will: abilities.intelligence,
        perception: abilities.intelligence,
        // lift: (abilities.strength * abilities.strength) / 5,
        agility: (abilities.vigor + abilities.dexterity) / 4,
        accuracy: abilities.dexterity - 2,
        evade: abilities.dexterity - 8,
      },
    )
}

export const getDamageResistances = (
  character: CharacterT,
): DamageTypeRollsT => {
  const armor = character.armor
  const keys = getDamageTypeKeys(character.damageResistances)
  return reduce<DamageTypeKeyT, DamageTypeRollsT>(
    keys,
    (result, key) => {
      return {
        ...result,
        [key]: combineCharacterRolls(
          result[key] as CharacterRollT,
          ...armor.map((a) => a.damageResistances[key] as CharacterRollT),
        ),
      }
    },
    character.damageResistances,
  )
}

export const processCharacter = (
  character: CharacterT,
  withWeapon: boolean = true,
): ProcessedCharacterT => {
  if ((character as ProcessedCharacterT).processed)
    return character as ProcessedCharacterT
  character = withWeapon
    ? character
    : {
        ...character,
        weapon: undefined,
      }

  const abilities = getAbilities(character)
  const stats = getStats(character)
  const traits = getTraits(character)
  const damageResistances = getDamageResistances(character)
  const healthOffset = noneg(
    traits.reduce((p, c) => p - c.healthOffset, character.healthOffset),
  )
  return {
    ...character,
    healthOffset,
    weapon: processWeapon(character.weapon || FISTS),
    abilities,
    stats,
    traits,
    damageResistances,
    processed: true,
    dead: healthOffset >= stats.health,
  }
}

// TODO: Maybe add the rest, but healthOffset is the wonky one
export const commitTrait = (character: CharacterT) => (
  trait: CharacterTraitT,
): CharacterT => {
  return {
    ...character,
    healthOffset: noneg(character.healthOffset - trait.healthOffset),
    focusOffset: noneg(character.focusOffset - trait.focusOffset),
  }
}

export const getModifierValueFromKeys = (character: ProcessedCharacterT) => (
  keys: CharacterSkillCheckKeyT[],
) =>
  (keys as any[]).reduce((total: number = 0, key: CharacterSkillCheckKeyT) => {
    const a: number = character.abilities[key as CharacterAbilityKeyT]
    const s: number = character.stats[key as CharacterStatKeyT]
    if (a) total += a
    if (s) total += s
    return total
  }, 0)

export const setCharacterAbilityScore = (character: CharacterT) => (
  key: CharacterAbilityKeyT,
  value: number,
  characterPoints: number = character.resources.characterPoints,
): [CharacterT, EquippableT[]] =>
  validateCharacter({
    ...character,
    power:
      character.power + (character.resources.characterPoints - characterPoints),
    resources: {
      ...character.resources,
      characterPoints,
    },
    abilities: {
      ...character.abilities,
      [key]: value,
    },
  })

export const CharacterKeyMap3: Record<CharacterSkillCheckKeyT, string> = {
  strength: 'STR',
  dexterity: 'DEX',
  intelligence: 'INT',
  vigor: 'VIG',
  health: 'HLT',
  focus: 'FOC',
  will: 'WIL',
  perception: 'PER',
  // lift: 'LFT',
  agility: 'AGL',
  accuracy: 'ACC',
  evade: 'EVD',
}

export const characterAbilityScoreCosts: Record<
  CharacterAbilityKeyT,
  number
> = {
  strength: 10,
  dexterity: 20,
  intelligence: 20,
  vigor: 10,
}

export const CharacterStatsCostsMap: Record<CharacterSkillCheckKeyT, number> = {
  ...characterAbilityScoreCosts,
  health: 5,
  focus: 5,
  will: 10,
  perception: 10,
  // lift: 1,
  agility: 10,
  accuracy: 10,
  evade: 10,
}

export const canEquip = (character: CharacterT) => (
  item: EquippableT,
  withWeapon?: boolean,
): boolean => {
  if (!item) return false
  if (!item.equippable) return false
  const equipable = item as EquippableT
  const processedCharacter = processCharacter(character, withWeapon)
  if (
    !resolveCharacterCheck(equipable.requirementCheck, processedCharacter)
      .result
  )
    return false
  if (equipable.type === 'weapon' && character.weapon) {
    return false
  } else {
    if (processedCharacter.resources[equipable.resource] < equipable.cost)
      return false
  }
  return true
}

export const equipItem = (character: CharacterT) => (
  item: EquippableT,
): CharacterT => {
  if (!canEquip(character)(item)) return character
  if (item.type === 'armor') return equipArmor(character)(item as ArmorT)
  if (item.type === 'weapon') return equipWeapon(character)(item as WeaponT)
  return equipGenericItem(character)(item)
}

export const unequipItem = (
  character: CharacterT,
  validate: boolean = true,
) => (itemId: string): [EquippableT[], CharacterT] => {
  let equippables: EquippableT[] = []
  let c = { ...character }
  if (character.weapon?.id === itemId) {
    equippables = [{ ...character.weapon }]
    c = unequipWeapon(c)
  }
  const armor = character.armor.find((i) => i.id === itemId)
  if (armor) {
    equippables = [{ ...armor }]
    c = unequipArmor(character)(armor)
  }
  const item = character.equippedItems.find((i) => i.id === itemId)
  if (item) {
    equippables = [{ ...item }]
    c = unequipGenericItem(character)(item)
  }
  if (validate) {
    let vr = validateCharacter(c)
    c = vr[0]
    equippables = [...equippables, ...vr[1]]
  }
  return [equippables, c]
}

export const equipGenericItem = (character: CharacterT) => (
  item: EquippableT,
): CharacterT => {
  const resourceValue = character.resources[item.resource]
  return {
    ...character,
    resources: {
      ...character.resources,
      [item.resource]: resourceValue - item.cost,
    },
    equippedItems: [...character.equippedItems, item],
  }
}

export const unequipGenericItem = (character: CharacterT) => (
  item: EquippableT,
): CharacterT => {
  if (!item) return character
  const resourceValue = character.resources[item.resource]
  return {
    ...character,
    resources: {
      ...character.resources,
      [item.resource]: resourceValue + item.cost,
    },
    equippedItems: character.equippedItems.filter((i) => i.id !== item.id),
  }
}

export const equipArmor = (character: CharacterT) => (
  item: ArmorT,
): CharacterT => {
  const resourceValue = character.resources[item.resource]
  return {
    ...character,
    resources: {
      ...character.resources,
      [item.resource]: resourceValue - item.cost,
    },
    armor: [...character.armor, item],
  }
}

export const unequipArmor = (character: CharacterT) => (
  item: ArmorT,
): CharacterT => {
  if (!item) return character
  const resourceValue = character.resources[item.resource]
  return {
    ...character,
    resources: {
      ...character.resources,
      [item.resource]: resourceValue + item.cost,
    },
    armor: character.armor.filter((i) => i.id !== item.id),
  }
}

export const equipWeapon = (character: CharacterT) => (
  item: WeaponT,
): CharacterT => {
  if (item.type !== 'weapon') return character
  let weapon = character.weapon
  if (weapon?.id === FISTS.id) weapon = undefined
  return {
    ...character,
    resources: {
      ...character.resources,
      weaponHands:
        character.resources.weaponHands -
        item.cost +
        (weapon ? weapon.cost : 0),
    },
    weapon: item,
  }
}

export const unequipWeapon = (character: CharacterT): CharacterT => {
  if (!character.weapon) return character
  return {
    ...character,
    resources: {
      ...character.resources,
      weaponHands: character.resources.weaponHands + character.weapon.cost,
    },
    weapon: undefined,
  }
}

export const getTraitValue = (
  trait: CharacterTraitT,
  key: CharacterSkillCheckKeyT,
) => {
  const abilityValue = trait.abilitiesModifiers[key as CharacterAbilityKeyT]
  const statValue = trait.statsModifiers[key as CharacterStatKeyT]
  return abilityValue !== undefined ? abilityValue : statValue
}

export const combineTraits = (traits: CharacterTraitT[]): CharacterTraitT => {
  const id = v4()
  const name = 'combine' + id
  return traits.reduce((result, current) => {
    const ar = result.abilitiesModifiers
    const ac = current.abilitiesModifiers
    const sr = result.statsModifiers
    const sc = current.statsModifiers
    return {
      id,
      name,
      duration: current.duration,
      healthOffset: result.healthOffset + current.healthOffset,
      focusOffset: result.focusOffset + current.focusOffset,
      abilitiesModifiers: {
        strength: ar.strength + ac.strength,
        dexterity: ar.dexterity + ac.dexterity,
        intelligence: ar.intelligence + ac.intelligence,
        vigor: ar.vigor + ac.vigor,
      },
      statsModifiers: {
        health: sr.health + sc.health,
        focus: sr.focus + sc.focus,
        will: sr.will + sc.will,
        perception: sr.perception + sc.perception,
        agility: sr.agility + sc.agility,
        accuracy: sr.accuracy + sc.accuracy,
        evade: sr.evade + sc.evade,
      },
    }
  }, makeTrait())
}

export const validateCharacter = (
  character: CharacterT,
): [CharacterT, EquippableT[]] => {
  let pc = processCharacter(character)
  let result = { ...character }
  let removedItems: EquippableT[] = []
  const localUpdate = (c: CharacterT) => {
    result = { ...c }
    pc = processCharacter(c)
  }
  if (!resolveCharacterCheck(pc.weapon.requirementCheck, pc).result) {
    const unequipResult = unequipItem(result, false)(pc.weapon.id)
    localUpdate(unequipResult[1])
    if (unequipResult[0]) removedItems = [...removedItems, ...unequipResult[0]]
  }
  pc.armor.forEach((i) => {
    if (!resolveCharacterCheck(i.requirementCheck, pc).result) {
      const unequipResult = unequipItem(result, false)(i.id)
      localUpdate(unequipResult[1])
      if (unequipResult[0])
        removedItems = [...removedItems, ...unequipResult[0]]
    }
  })
  pc.equippedItems.forEach((i) => {
    if (!resolveCharacterCheck(i.requirementCheck, pc).result) {
      if (!resolveCharacterCheck(i.requirementCheck, pc).result) {
        const unequipResult = unequipItem(result, false)(i.id)
        localUpdate(unequipResult[1])
        if (unequipResult[0])
          removedItems = [...removedItems, ...unequipResult[0]]
      }
    }
  })

  if (
    result.weapon?.id !== character.weapon?.id ||
    result.armor.length !== character.armor.length ||
    result.equippedItems.length !== result.equippedItems.length
  ) {
    const [ret, items] = validateCharacter(result)
    removedItems = [...removedItems, ...items]
    localUpdate(ret)
  }
  return [result, removedItems]
}
