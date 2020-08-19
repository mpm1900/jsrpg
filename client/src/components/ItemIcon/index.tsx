import React from 'react'
import { Icon } from '../Icon'
import { IconItemTypeMap } from '../../icons/maps'
import { EquippableT } from '../../types/Item'

export interface ItemIconPropsT {
  item: EquippableT
  size: number
  fill?: string
  style?: React.CSSProperties
}
export const ItemIcon = (props: ItemIconPropsT) => {
  const { item, size, fill, style } = props
  const src = IconItemTypeMap[item.type]

  return <Icon src={src} size={size} fill={fill} style={style} />
}
