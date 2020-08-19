import {
  rollCheck,
  RollCheckT,
  basicRoll,
  getProbability,
  RollResultT,
  considateRollChecks,
} from './Roll'
import { WeaponT } from './Weapon'
import { ItemT, EquippableT } from './Item'
import { FISTS } from '../objects/fists'
import { DamageTypeRollsT, getDamageTypeKeys, DamageTypeKeyT } from './Damage'
import { ArmorT } from './Armor'
import { reduce } from '../util/reduce'
import { v4 } from 'uuid'

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
  | 'lift'
  | 'agility'
  | 'speed'
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
  abilitiesModifiers: CharacterAbilitiesT
  statsModifiers: CharacterStatsT
}

export interface CharacterSkillT {
  id: string
  name: string
  check: RollCheckT
}

export interface CharacterT {
  name: string
  id: string
  power: number
  resources: CharacterResourcesT
  abilities: CharacterAbilitiesT
  damageResistances: DamageTypeRollsT
  traits: CharacterTraitT[]
  skills: CharacterSkillT[]

  items: ItemT[]
  equippedItems: EquippableT[]
  armor: ArmorT[]
  weapon?: WeaponT
}
export interface ProcessedCharacterT extends CharacterT {
  stats: CharacterStatsT
  weapon: WeaponT
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
    ...(character?.weapon?.traits || []),
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
        lift: result.lift + cur.lift,
        agility: result.agility + cur.agility,
        speed: result.speed + cur.speed,
      }),
      {
        health: abilities.strength,
        focus: abilities.vigor,
        will: abilities.intelligence,
        perception: abilities.intelligence,
        lift: (abilities.strength * abilities.strength) / 5,
        agility: (abilities.vigor + abilities.dexterity) / 4,
        speed: Math.floor((abilities.vigor + abilities.dexterity) / 4),
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
        [key]: considateRollChecks([
          result[key] as RollCheckT,
          ...armor.map((a) => a.damageResistances[key] as RollCheckT),
        ]),
      }
    },
    character.damageResistances,
  )
}

export const getAllEquippables = (
  character: ProcessedCharacterT,
): EquippableT[] => {
  let result: EquippableT[] = (character.items as EquippableT[]).filter(
    (i) => i.type,
  )
  result = [...result, ...character.armor]
  if (character.weapon) result = [...result, character.weapon]
  return result
}

export const getAllWeapons = (character: ProcessedCharacterT): WeaponT[] => {
  let result: WeaponT[] = (character.items as WeaponT[]).filter(
    (i) => i.type === 'weapon',
  )
  if (character.weapon) result = [...result, character.weapon]
  return result
}

export const getAllArmor = (character: ProcessedCharacterT): ArmorT[] => {
  let result: ArmorT[] = (character.items as ArmorT[]).filter((i) => i.type)
  result = [...result, ...character.armor]
  return result
}

export const processCharacter = (
  character: CharacterT,
  withWeapon: boolean = true,
): ProcessedCharacterT => {
  if ((character as ProcessedCharacterT).processed)
    throw new Error('Bad Character')
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
  return {
    ...character,
    weapon: character.weapon || FISTS,
    abilities,
    stats,
    traits,
    damageResistances,
    processed: true,
  }
}

const getModifierValueFromKeys = (character: ProcessedCharacterT) => (
  keys: CharacterSkillCheckKeyT[],
) =>
  (keys as any[]).reduce((total: number = 0, key: CharacterSkillCheckKeyT) => {
    const a: number = character.abilities[key as CharacterAbilityKeyT]
    const s: number = character.stats[key as CharacterStatKeyT]
    if (a) total += a
    if (s) total += s
    return total
  }, 0)

export const checkCharacter = (character: ProcessedCharacterT) => (
  check: RollCheckT,
): RollResultT => {
  const { keys = [], roll, value = 0 } = check
  const modifiers = getModifierValueFromKeys(character)(keys)

  return rollCheck({
    roll,
    keys,
    value,
    modifiers,
  })
}

export const getCharacterCheckProbability = (
  character: ProcessedCharacterT,
) => (check: RollCheckT): number => {
  const { keys = [], roll, value = 0 } = check
  const modifiers = getModifierValueFromKeys(character)(keys)

  return getProbability({
    roll,
    keys,
    value,
    modifiers,
  })
}

export const basicRollCharacter = (character: ProcessedCharacterT) => (
  check: RollCheckT,
  allowNegatives?: boolean,
): any => {
  const { keys = [], roll, value = 0 } = check
  const modifiers = getModifierValueFromKeys(character)(keys)
  return basicRoll(
    {
      roll,
      keys,
      value,
      modifiers,
    },
    allowNegatives,
  )
}

export const setCharacterAbilityScore = (character: CharacterT) => (
  key: CharacterAbilityKeyT,
  value: number,
  characterPoints: number = character.resources.characterPoints,
): CharacterT =>
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
  lift: 'LFT',
  agility: 'AGL',
  speed: 'SPD',
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

export const canEquip = (character: CharacterT) => (
  itemId: string,
  withWeapon?: boolean,
): boolean => {
  const item = character.items.find((item) => item.id === itemId) as EquippableT
  if (!item) return false
  if (!item.equippable) return false
  const equipable = item as EquippableT
  const processedCharacter = processCharacter(character, withWeapon)
  if (!checkCharacter(processedCharacter)(equipable.requirementCheck).result)
    return false
  if (equipable.type === 'weapon' && character.weapon) {
    if (
      processedCharacter.resources[equipable.resource] + character.weapon.cost <
      equipable.cost
    )
      return false
  } else {
    if (processedCharacter.resources[equipable.resource] < equipable.cost)
      return false
  }
  return true
}

export const equipItem = (character: CharacterT) => (
  itemId: string,
): CharacterT => {
  if (!canEquip(character)(itemId)) return character
  const item = character.items.find((item) => item.id === itemId) as EquippableT
  if (item.type === 'armor') return equipArmor(character)(item as ArmorT)
  if (item.type === 'weapon') return equipWeapon(character)(item as WeaponT)
  return equipGenericItem(character)(item)
}

export const unequipItem = (character: CharacterT) => (
  itemId: string,
): CharacterT => {
  if (character.weapon?.id === itemId)
    return validateCharacter(unequipWeapon(character))
  const armor = character.armor.find((i) => i.id === itemId)
  if (armor) return validateCharacter(unequipArmor(character)(armor))
  const item = character.equippedItems.find((i) => i.id === itemId)
  if (item) return validateCharacter(unequipGenericItem(character)(item))
  return character
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
    items: character.items.filter((i) => i.id !== item.id),
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
    items: [...character.items, item],
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
    items: character.items.filter((i) => i.id !== item.id),
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
    items: [...character.items, item],
  }
}

export const equipWeapon = (character: CharacterT) => (
  item: WeaponT,
): CharacterT => {
  if (item.type !== 'weapon') return character
  let weapon = character.weapon
  if (weapon?.id === FISTS.id) weapon = undefined
  const items = character.items.filter((i) => i.id !== item.id)
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
    items: weapon ? [...items, weapon] : items,
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
    items:
      character.weapon.id === FISTS.id
        ? character.items
        : [...character.items, character.weapon],
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
  return traits.reduce(
    (result, current) => {
      const ar = result.abilitiesModifiers
      const ac = current.abilitiesModifiers
      const sr = result.statsModifiers
      const sc = current.statsModifiers
      return {
        id,
        name,
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
          lift: sr.lift + sc.lift,
          agility: sr.agility + sc.agility,
          speed: sr.speed + sc.speed,
        },
      }
    },
    {
      id: '',
      name: '',
      abilitiesModifiers: {
        strength: 0,
        dexterity: 0,
        intelligence: 0,
        vigor: 0,
      },
      statsModifiers: {
        health: 0,
        focus: 0,
        will: 0,
        perception: 0,
        lift: 0,
        agility: 0,
        speed: 0,
      },
    },
  )
}

export const validateCharacter = (character: CharacterT): CharacterT => {
  const pc = processCharacter(character)
  const checker = checkCharacter(pc)
  let result = character
  if (!checker(pc.weapon.requirementCheck).result) {
    result = unequipItem(result)(pc.weapon.id)
  }
  pc.armor.forEach((i) => {
    if (!checker(i.requirementCheck).result) {
      result = unequipItem(character)(i.id)
    }
  })
  pc.equippedItems.forEach((i) => {
    if (!checker(i.requirementCheck).result) {
      result = unequipItem(character)(i.id)
    }
  })
  return result
}
