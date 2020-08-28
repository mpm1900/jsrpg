import { CharacterT } from '../types/Character'
import { makeStaticRoll } from '../types/Roll'
import { buildArmor } from './builders/armor/createArmor'
import { getRandom } from '../util/getRandom'
import { buildWeapon } from './builders/weapons/createWeapon'
import { v4 } from 'uuid'
/*
import { Config, adjectives, names } from 'unique-names-generator'

const config: Config = {
  dictionaries: [adjectives, names],
  length: 2,
  separator: ' ',
}
*/

export const BASE_CHARACTER: CharacterT = {
  name: '-- init --', //uniqueNamesGenerator(config),
  id: v4(),
  power: 0,
  resources: {
    characterPoints: 0,
    weaponHands: 0,
    heads: 0,
    bodies: 0,
    hands: 0,
    fingers: 0,
    feet: 0,
  },
  abilities: {
    strength: 0,
    dexterity: 0,
    intelligence: 0,
    vigor: 0,
  },
  damageResistances: {
    slashing: makeStaticRoll(0),
    piercing: makeStaticRoll(0),
    fire: makeStaticRoll(0),
    blood: makeStaticRoll(0),
    light: makeStaticRoll(0),
    dark: makeStaticRoll(0),
  },

  traits: [],
  skills: [],

  equippedItems: [],
  armor: [],

  healthOffset: 0,
  focusOffset: 0,
  dead: false,
  inspected: false,
}
