import { NpcT } from '../types/Npc'
import { v4 } from 'uuid'

import {
  uniqueNamesGenerator,
  Config,
  names,
  adjectives,
  animals,
  colors,
} from 'unique-names-generator'
import { CharacterResourcesT, CharacterAbilitiesT } from '../types/Character'
import { DamageTypeRollsT } from '../types/Damage'
import { buildWeapon } from './builders/weapons/createWeapon'
import { getRandom } from '../util/getRandom'
import { buildArmor } from './builders/armor/createArmor'
import { makeSkill, BASIC_ATTACK } from './makeSkill'
import { makeCharacterRoll } from '../types/Roll2'

const randomNameConfig: Config = {
  dictionaries: [adjectives, animals],
  length: 2,
  separator: ' ',
}

export const makeNpc = (
  abilities: Partial<CharacterAbilitiesT> = {},
  damageResistances: Partial<DamageTypeRollsT> = {},
  resources: Partial<CharacterResourcesT> = {},
): NpcT => {
  return {
    id: v4(),
    npc: true,
    name: uniqueNamesGenerator(randomNameConfig),
    power: 600,
    resources: {
      characterPoints: 250,
      weaponHands: 2,
      heads: 1,
      bodies: 1,
      hands: 2,
      fingers: 10,
      feet: 2,
      ...resources,
    },
    abilities: {
      strength: 10,
      dexterity: 10,
      intelligence: 10,
      vigor: 10,
      ...abilities,
    },
    damageResistances: {
      slashing: makeCharacterRoll([]),
      piercing: makeCharacterRoll([]),
      fire: makeCharacterRoll([]),
      blood: makeCharacterRoll([]),
      light: makeCharacterRoll([]),
      dark: makeCharacterRoll([]),
      ...damageResistances,
    },

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

    traits: [],
    skills: [BASIC_ATTACK],
    equippedItems: [],
    armor: [
      buildArmor('cowl'),
      buildArmor('chestplate'),
      buildArmor('gloves'),
      buildArmor('boots'),
    ],

    healthOffset: 0,
    focusOffset: 0,
    dead: false,
    inspected: false,
  }
}
