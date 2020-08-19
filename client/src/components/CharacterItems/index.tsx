import React, { useMemo, useState } from 'react'
import { useCharacterContext } from '../../contexts/CharacterContext'
import { ItemT, EquippableT, ItemRarityColorMap } from '../../types/Item'
import { CharacterT, canEquip, equipItem } from '../../types/Character'
import { WeaponIcon } from '../WeaponIcon'
import { WeaponT } from '../../types/Weapon'
import { BoxContainer } from '../../elements/box'
import { FlexContainer } from '../../elements/flex'
import Tooltip from 'react-tooltip-lite'
import { ArmorIcon } from '../ArmorIcon'
import { ArmorT } from '../../types/Armor'
import { EquipedWeaponCompare } from '../WeaponCompare'
import { ItemPreview } from '../ItemPreview'
import { ItemIcon } from '../ItemIcon'
import { EquipeItemCompare } from '../ItemCompare'

export const CharacterItems = () => {
  const { character, rawCharacter, onChange } = useCharacterContext()
  return (
    <div>
      <FlexContainer style={{ flexWrap: 'wrap' }}>
        {character.items.map((item) => (
          <Item
            key={item.id}
            item={item}
            rawCharacter={rawCharacter}
            onEquip={(id) => onChange(equipItem(rawCharacter)(id))}
          />
        ))}
      </FlexContainer>
    </div>
  )
}

export interface ItemPropsT {
  item: ItemT
  rawCharacter: CharacterT
  onEquip: (itemId: string) => void
}
const Item = (props: ItemPropsT) => {
  const { item, rawCharacter, onEquip } = props
  const [isHovering, setIsHovering] = useState(false)
  const type = (item as EquippableT).type
  const isEquipable = (item as EquippableT).equippable
  const isArmor = type === 'armor'
  const isWeapon = type === 'weapon'
  const canEquipItem = useMemo(
    () => canEquip(rawCharacter)(item.id, !isWeapon),
    [item, rawCharacter, isWeapon],
  )
  const iconSize = 18
  const rarityColor = ItemRarityColorMap[item.rarity]
  const icon = useMemo(() => {
    if (isWeapon) {
      return (
        <WeaponIcon
          weapon={item as WeaponT}
          size={iconSize}
          fill={rarityColor}
        />
      )
    }
    if (isArmor) {
      return (
        <ArmorIcon item={item as ArmorT} size={iconSize} fill={rarityColor} />
      )
    }
    if (isEquipable) {
      return (
        <ItemIcon
          item={item as EquippableT}
          size={iconSize}
          fill={rarityColor}
        />
      )
    }
  }, [item, isArmor, isEquipable, isWeapon, type])

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
          isWeapon ? (
            <EquipedWeaponCompare weapon={item as WeaponT} />
          ) : isEquipable ? (
            <EquipeItemCompare item={item as EquippableT} />
          ) : (
            'item'
          )
        }
      >
        <BoxContainer
          style={{ width: 40, height: 40 }}
          substyle={{
            backgroundColor: !canEquipItem ? '#444' : '#222',
            cursor: canEquipItem ? 'pointer' : 'default',
            borderColor: isHovering ? rarityColor : '#555',
            boxShadow: 'inset 0 0 3px black',
            display: 'flex',
            padding: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            if (isEquipable) {
              onEquip(item.id)
            }
          }}
        >
          {icon}
        </BoxContainer>
      </Tooltip>
    </div>
  )
}
