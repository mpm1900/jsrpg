import { CharacterT } from '../types/Character'
import { LONG_SWORD } from './longSword'
import { GREAT_SWORD } from './greatSword'
import { makeStaticRoll } from '../types/Roll'
import { BASIC_HELMET } from './basicHelmet'
import { BASIC_CHESTPLATE } from './basicChestplate'
import { BASIC_ROBE } from './basicRobe'
import { BASIC_SHIELD } from './basicShield'
import { BASIC_COWL } from './basicHood'
import { BASIC_BOOTS } from './basicBoots'
import { BASIC_TOME } from './basicTome'
import { BASIC_GLOVES } from './basicGloves'
import { BASIC_RING } from './basicRing'
import { makeElementalSword } from './builders/makeElementalSword'
import { makeLongsword } from './builders/makeLongsword'
import { makePistol } from './builders/makePistol'
import { makeRing } from './builders/makeRing'

export const BASE_CHARACTER: CharacterT = {
  name: 'Test Character',
  id: 'base',
  power: 600,
  resources: {
    characterPoints: 250,
    weaponHands: 0,
    heads: 0,
    bodies: 0,
    hands: 0,
    fingers: 3,
    feet: 0,
  },
  abilities: {
    strength: 10,
    dexterity: 10,
    intelligence: 10,
    vigor: 10,
  },
  damageResistances: {
    slashing: makeStaticRoll(-2, '1d4'),
    crushing: makeStaticRoll(-2, '1d4'),
    fire: makeStaticRoll(-2, '1d4'),
    blood: makeStaticRoll(-2, '1d4'),
    light: makeStaticRoll(-2, '1d4'),
    dark: makeStaticRoll(-2, '1d4'),
  },

  traits: [],
  skills: [],

  weapon: makeElementalSword('fire'),

  items: [
    GREAT_SWORD,
    BASIC_HELMET,
    BASIC_CHESTPLATE,
    BASIC_TOME,
    makeElementalSword('blood'),
    makeElementalSword('light'),
    makeElementalSword('dark'),
    makeLongsword(),
    makeLongsword(),
    makeLongsword(),
    makeLongsword(),
    makeLongsword(),
    makePistol(),
    makePistol(),
    makePistol(),
    makePistol(),
    makePistol(),
    makePistol(),
    makePistol(),
    ...Array(101)
      .fill(null)
      .map(() => makeRing()),
  ],
  equippedItems: [BASIC_SHIELD],
  armor: [
    BASIC_COWL,
    BASIC_ROBE,
    BASIC_GLOVES,
    BASIC_BOOTS,
    makeRing(),
    makeRing(),
    makeRing(),
    makeRing(),
    makeRing(),
    makeRing(),
    makeRing(),
    makeRing(),
    makeRing(),
    makeRing(),
  ],
}
