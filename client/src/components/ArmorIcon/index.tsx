import React from 'react'
import { Icon } from '../Icon'
import { IconArmorTypeMap } from '../../icons/maps'
import { ArmorT } from '../../types/Armor'

export interface ArmorIconPropsT {
  item: ArmorT
  size: number
  fill?: string
  style?: React.CSSProperties
}
export const ArmorIcon = (props: ArmorIconPropsT) => {
  const { item, size, fill, style } = props
  const src = IconArmorTypeMap[item.armorType]

  return <Icon src={src} size={size} fill={fill} style={style} />
}
