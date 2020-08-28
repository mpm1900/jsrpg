import { CharacterT } from '../types/Character'
import { makeStaticRoll } from '../types/Roll'
import { buildArmor } from './builders/armor/createArmor'
import { getRandom } from '../util/getRandom'
import { buildWeapon } from './builders/weapons/createWeapon'
import { v4 } from 'uuid'
import { makeSkill, BASIC_ATTACK } from './makeSkill'
/*
import { Config, adjectives, names } from 'unique-names-generator'

const config: Config = {
  dictionaries: [adjectives, names],
  length: 2,
  separator: ' ',
}
*/

export const makeCharacter = (name?: string): CharacterT => ({
  name: name || '-- init --', //uniqueNamesGenerator(config),
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
  skills: [BASIC_ATTACK],

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
  focusOffset: 0,
  dead: false,
})
