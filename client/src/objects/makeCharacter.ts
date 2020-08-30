import { CharacterT } from '../types/Character'
import { buildArmor } from './builders/armor/createArmor'
import { getRandom } from '../util/getRandom'
import { buildWeapon } from './builders/weapons/createWeapon'
import { v4 } from 'uuid'
import { makeSkill, BASIC_ATTACK, INSPECT } from './makeSkill'
import { makeCharacterRoll } from '../types/Roll2'
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
    characterPoints: 0,
    weaponHands: 1,
    heads: 0,
    bodies: 0,
    hands: 0,
    fingers: 10,
    feet: 0,
  },
  abilities: {
    strength: 10,
    dexterity: 10,
    intelligence: 10,
    vigor: 10,
  },
  damageResistances: {
    slashing: makeCharacterRoll([]),
    piercing: makeCharacterRoll([]),
    fire: makeCharacterRoll([]),
    blood: makeCharacterRoll([]),
    light: makeCharacterRoll([]),
    dark: makeCharacterRoll([]),
  },

  traits: [],
  skills: [BASIC_ATTACK, INSPECT],

  equippedItems: [],
  armor: [
    buildArmor(getRandom(['cowl', 'helmet']), 'common'),
    buildArmor(getRandom(['chestplate', 'robe']), 'common'),
    buildArmor('gloves', 'common'),
    buildArmor('boots', 'common'),
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
  inspected: false,
})
