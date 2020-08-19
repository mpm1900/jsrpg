import React from 'react'
import { WeaponT, WeaponIconKeyT } from '../../types/Weapon'
import { Icon } from '../Icon'
import { IconUniqueWeaponMap, IconWeaponTypeMap } from '../../icons/maps'

export interface WeaponIconPropsT {
  weapon: WeaponT
  size: number
  fill?: string
  style?: React.CSSProperties
}
export const WeaponIcon = (props: WeaponIconPropsT) => {
  const { weapon, size, fill, style } = props
  const src = weapon.icon
    ? IconUniqueWeaponMap[weapon.icon as WeaponIconKeyT]
    : IconWeaponTypeMap[weapon.weaponType]

  return <Icon src={src} size={size} fill={fill} style={style} />
}
