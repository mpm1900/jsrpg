import { CharacterT } from '../types/Character'
import { makeStaticRoll } from '../types/Roll'
import { BASIC_SHIELD } from './basicShield'
import { BASIC_TOME } from './basicTome'
import makeItem from './builders/makeItem'
import { buildWeapon } from './builders/weapons/createWeapon'

export const BASE_CHARACTER: CharacterT = {
  name: 'Test Character',
  id: 'base',
  power: 600,
  resources: {
    characterPoints: 250,
    weaponHands: 2,
    heads: 1,
    bodies: 1,
    hands: 2,
    fingers: 10,
    feet: 2,
  },
  abilities: {
    strength: 10,
    dexterity: 10,
    intelligence: 10,
    vigor: 10,
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

  items: [
    BASIC_SHIELD,
    BASIC_TOME,
    ...Array(204)
      .fill(null)
      .map(() => makeItem()),
  ],
  equippedItems: [],
  armor: [],

  healthOffset: 0,
}
