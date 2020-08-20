import { CharacterResourceKeyT } from '../types/Character'
import WeaponHands from '../icons/svg/delapouite/sword-brandish.svg'
import CharacterPoints from '../icons/svg/lorc/aura.svg'
import Heads from '../icons/svg/lorc/barbute.svg'
import Bodies from '../icons/svg/delapouite/muscular-torso.svg'
import Hands from '../icons/svg/sbed/hand.svg'
import Finger from '../icons/svg/delapouite/ring.svg'
import Feet from '../icons/svg/lorc/footprint.svg'
import Slashing from '../icons/svg/lorc/quick-slash.svg'
import Piercing from '../icons/svg/lorc/barbed-arrow.svg'
import Fire from '../icons/svg/carl-olsen/flame.svg'
import Blood from '../icons/svg/lorc/bleeding-eye.svg'
import Light from '../icons/svg/lorc/moebius-trefoil.svg'
import Dark from '../icons/svg/lorc/triorb.svg'
import Shield from '../icons/svg/sbed/shield.svg'
import Tome from '../icons/svg/lorc/book-cover.svg'
import Fists from '../icons/svg/skoll/fist.svg'
import Axe from '../icons/svg/lorc/fire-axe.svg'
import GreatAxe from '../icons/svg/delapouite/war-axe.svg'
import Sword from '../icons/svg/lorc/stiletto.svg'
import Greatsword from '../icons/svg/lorc/croc-sword.svg'
import Flail from '../icons/svg/delapouite/flail.svg'
import Daggers from '../icons/svg/lorc/crossed-swords.svg'
import Katana from '../icons/svg/delapouite/katana.svg'
import Rapier from '../icons/svg/lorc/sword-hilt.svg'
import Wand from '../icons/svg/willdabeast/orb-wand.svg'
import Staff from '../icons/svg/lorc/wizard-staff.svg'
import Pistol from '../icons/svg/skoll/luger.svg'
import Crossbow from '../icons/svg/carl-olsen/crossbow.svg'
import FireSword from '../icons/svg/lorc/shard-sword.svg'
import BloodSword from '../icons/svg/lorc/bloody-sword.svg'
import LightSword from '../icons/svg/lorc/winged-sword.svg'
import DarkSword from '../icons/svg/lorc/spiral-thrust.svg'
import Helmet from '../icons/svg/delapouite/closed-barbute.svg'
import Cowl from '../icons/svg/lorc/hood.svg'
import Armor from '../icons/svg/delapouite/shoulder-armor.svg'
import Robe from '../icons/svg/lorc/robe.svg'
import Gloves from '../icons/svg/delapouite/gloves.svg'
import Ring from '../icons/svg/delapouite/power-ring.svg'
import Boots from '../icons/svg/lorc/boots.svg'
import { DamageTypeKeyT } from '../types/Damage'
import { WeaponTypeT, WeaponIconKeyT } from '../types/Weapon'
import { ArmorTypeT } from '../types/Armor'
import { ItemTypeT } from '../types/Item'

export const IconCharacterResourceMap: Record<CharacterResourceKeyT, string> = {
  weaponHands: WeaponHands,
  characterPoints: CharacterPoints,
  heads: Heads,
  bodies: Bodies,
  hands: Hands,
  fingers: Finger,
  feet: Feet,
}

export const IconDamageTypeMap: Record<DamageTypeKeyT, string> = {
  slashing: Slashing,
  piercing: Piercing,
  fire: Fire,
  blood: Blood,
  light: Light,
  dark: Dark,
}

export const IconItemTypeMap: Record<ItemTypeT, string> = {
  weapon: '',
  armor: '',
  shield: Shield,
  tome: Tome,
}

export const IconWeaponTypeMap: Record<WeaponTypeT, string> = {
  fists: Fists,
  axe: Axe,
  greataxe: GreatAxe,
  flail: Flail,
  daggers: Daggers,
  katana: Katana,
  rapier: Rapier,
  wand: Wand,
  staff: Staff,
  elementalSword: FireSword,
  elementalGreatsword: DarkSword,
  sword: Sword,
  greatsword: Greatsword,
  pistol: Pistol,
  crossbow: Crossbow,
}

export const IconUniqueWeaponMap: Record<WeaponIconKeyT, string> = {
  'fire-sword': FireSword,
  'blood-sword': BloodSword,
  'light-sword': LightSword,
  'dark-sword': DarkSword,
}

export const IconArmorTypeMap: Record<ArmorTypeT, string> = {
  helmet: Helmet,
  cowl: Cowl,
  chestplate: Armor,
  robe: Robe,
  gloves: Gloves,
  ring: Ring,
  boots: Boots,
}
