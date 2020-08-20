import { NpcT } from '../types/Npc'
import { v4 } from 'uuid'
import { makeStaticRoll } from '../types/Roll'

import { uniqueNamesGenerator, Config, names } from 'unique-names-generator'
import { CharacterResourcesT, CharacterAbilitiesT } from '../types/Character'
import { DamageTypeRollsT } from '../types/Damage'
import { buildWeapon } from './builders/weapons/createWeapon'
import { getRandom } from '../util/getRandom'
import { buildArmor } from './builders/armor/createArmor'

const randomNameConfig: Config = {
  dictionaries: [names],
  length: 1,
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
      slashing: makeStaticRoll(0),
      piercing: makeStaticRoll(0),
      fire: makeStaticRoll(0),
      blood: makeStaticRoll(0),
      light: makeStaticRoll(0),
      dark: makeStaticRoll(0),
      ...damageResistances,
    },

    weapon: buildWeapon(getRandom(['axe'])),

    traits: [],
    skills: [],
    items: [],
    equippedItems: [],
    armor: [
      buildArmor('cowl'),
      buildArmor('chestplate'),
      buildArmor('gloves'),
      buildArmor('boots'),
    ],

    healthOffset: 0,
  }
}
