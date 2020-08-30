import React, { useState, useMemo } from 'react'
import Color from 'color'
import { BoxContainer } from '../../elements/box'
import { EquippableT, ItemRarityColorMap } from '../../types/Item'
import { ArmorIcon } from '../ArmorIcon'
import { ArmorT } from '../../types/Armor'
import { ItemPreview } from '../ItemPreview'
import Tooltip from 'react-tooltip-lite'
import { WeaponIcon } from '../WeaponIcon'
import { WeaponT } from '../../types/Weapon'
import { WeaponPreview } from '../WeaponPreview'
import { BASE_EQUIPPABLE } from '../../objects/util'

export interface ItemPreviewSmallPropsT {
  item: EquippableT
  size?: number
  onClick?: (item: EquippableT) => void
}
export const ItemPreviewSmall = (props: ItemPreviewSmallPropsT) => {
  const { item = BASE_EQUIPPABLE('armor'), size = 38, onClick } = props
  const [isHovering, setIsHovering] = useState(false)
  const isEmpty = item === undefined
  const rarityColor = ItemRarityColorMap[item ? item.rarity : 'common']
  const borderColor = Color(rarityColor)
    .desaturate(0.5)
    .fade(0.5)
    .rgb()
    .string()

  const isArmor = item.type === 'armor'
  const isWeapon = item.type === 'weapon'
  const icon = useMemo(() => {
    if (isWeapon) {
      return (
        <WeaponIcon
          weapon={item as WeaponT}
          size={size - 16}
          fill={rarityColor}
        />
      )
    }
    if (isArmor) {
      return (
        <ArmorIcon item={item as ArmorT} size={size - 6} fill={rarityColor} />
      )
    }
  }, [item, isArmor, isWeapon, rarityColor])
  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Tooltip
        isOpen={isHovering}
        direction='bottom'
        tagName='div'
        padding='0'
        arrow={false}
        content={
          item.type === 'armor' ? (
            <ItemPreview
              item={item}
              showEquipButton={false}
              showCollapseButton={false}
            />
          ) : (
            <WeaponPreview weapon={item as WeaponT} showEquipButton={false} />
          )
        }
      >
        <BoxContainer
          style={{
            height: size,
            width: size,
            cursor: item && onClick ? 'pointer' : 'default',
          }}
          substyle={{
            backgroundColor: isEmpty ? '#111' : '#222',
            boxShadow: 'inset 0 0 3px black',
            borderColor: item ? borderColor : '#555',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
          }}
          onClick={() => onClick && onClick(item)}
        >
          {icon}
        </BoxContainer>
      </Tooltip>
    </div>
  )
}
