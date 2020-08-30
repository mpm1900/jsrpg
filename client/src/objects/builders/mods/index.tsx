import { WeaponModT, ZERO_WEAPON_TRAIT } from '../../../types/Weapon'
import { v4 } from 'uuid'
import { makeCharacterRoll } from '../../../types/Roll2'

export const SLASHING_MOD: WeaponModT = {
  id: v4(),
  name: 'Slashing Mod',
  rarity: 'mythic',
  traits: [
    {
      ...ZERO_WEAPON_TRAIT,
      damageRolls: {
        slashing: makeCharacterRoll([], '1d6'),
      },
    },
  ],
}
