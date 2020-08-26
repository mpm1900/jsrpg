import { CharacterT } from '../types/Character'
import { makeStaticRoll } from '../types/Roll'
import { BASIC_SHIELD } from './basicShield'
import { BASIC_TOME } from './basicTome'
import makeItem, { makeWeapon } from './builders/makeItem'
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
  name: 'base character', //uniqueNamesGenerator(config),
  id: v4(),
  power: 600,
  resources: {
    characterPoints: 250,
    weaponHands: 1,
    heads: 0,
    bodies: 0,
    hands: 0,
    fingers: 0,
    feet: 0,
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
  armor: [
    buildArmor(getRandom(['cowl', 'helmet'])),
    buildArmor(getRandom(['chestplate', 'robe'])),
    buildArmor('gloves'),
    buildArmor('boots'),
    buildArmor('ring'),
    buildArmor('ring'),
    buildArmor('ring'),
    buildArmor('ring'),
    buildArmor('ring'),
    buildArmor('ring'),
    buildArmor('ring'),
    buildArmor('ring'),
    buildArmor('ring'),
    buildArmor('ring'),
  ],

  weapon: buildWeapon(
    getRandom([
      'axe',
      'greataxe',
      'wand',
      'staff',
      'daggers',
      'katana',
      'sword',
      'greatsword',
      'flail',
      'elementalGreatsword',
      'elementalSword',
    ]),
  ),

  healthOffset: 0,
  dead: false,
}
