import React, { useState } from 'react'
import Color from 'color'
import { BoxContainer } from '../../elements/box'
import { EquippableT, ItemRarityColorMap } from '../../types/Item'
import { ArmorIcon } from '../ArmorIcon'
import { ArmorT } from '../../types/Armor'
import { ItemPreview } from '../ItemPreview'
import Tooltip from 'react-tooltip-lite'

const size = 32
export interface ItemPreviewSmallPropsT {
  item?: EquippableT
  onClick?: (item: EquippableT) => void
}
export const ItemPreviewSmall = (props: ItemPreviewSmallPropsT) => {
  const { item, onClick } = props
  const [isHovering, setIsHovering] = useState(false)
  const isEmpty = item === undefined
  const rarityColor = ItemRarityColorMap[item ? item.rarity : 'common']
  const borderColor = Color(rarityColor)
    .desaturate(0.5)
    .fade(0.5)
    .rgb()
    .string()
  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Tooltip
        isOpen={isHovering}
        direction='left'
        tagName='div'
        padding='0'
        arrow={false}
        content={
          item &&
          item.type === 'armor' && (
            <div>
              <ItemPreview
                item={item as EquippableT}
                showEquipButton={false}
                showRequirementCheck={false}
                showCollapseButton={false}
              />
            </div>
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
          onClick={() => onClick && item && onClick(item)}
        >
          {item && (
            <ArmorIcon
              item={item as ArmorT}
              size={size - 16}
              fill={rarityColor}
            />
          )}
        </BoxContainer>
      </Tooltip>
    </div>
  )
}
