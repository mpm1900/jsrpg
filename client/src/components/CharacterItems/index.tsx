import React, { useMemo, useState } from 'react'
import Color from 'color'
import { useCharacterContext } from '../../contexts/CharacterContext'
import {
  ItemT,
  EquippableT,
  ItemRarityColorMap,
  ItemTypeT,
  ItemRarityT,
} from '../../types/Item'
import { CharacterT, canEquip } from '../../types/Character'
import { WeaponIcon } from '../WeaponIcon'
import { WeaponT } from '../../types/Weapon'
import { BoxContainer } from '../../elements/box'
import { FlexContainer } from '../../elements/flex'
import Tooltip from 'react-tooltip-lite'
import { ArmorIcon } from '../ArmorIcon'
import { ArmorT } from '../../types/Armor'
import { EquipedWeaponCompare } from '../WeaponCompare'
import { ItemIcon } from '../ItemIcon'
import { EquipeItemCompare } from '../ItemCompare'
import { CharacterItemFilters } from '../CharacterItemFilters'
import { usePartyContext } from '../../contexts/PartyContext'

export const CharacterItems = () => {
  const { rawCharacter } = useCharacterContext()
  const { userParty, equipItem } = usePartyContext()
  const [itemType, setItemType] = useState<ItemTypeT | undefined>()
  const [itemRarity, setItemRarity] = useState<ItemRarityT | undefined>()

  const filter = (i: EquippableT) => {
    if (itemType) return i.type === itemType
    if (itemRarity) return i.rarity === itemRarity
    return true
  }

  const other = userParty.items
    .filter((i) => i.type !== 'armor' && i.type !== 'weapon')
    .filter(filter)
  const weapons = userParty.items
    .filter((i) => i.type === 'weapon')
    .filter(filter)
  const armors = userParty.items
    .filter((i) => i.type === 'armor')
    .filter(filter)
  return (
    <FlexContainer style={{}} $direction='column'>
      <CharacterItemFilters
        onClick={(r, t) => {
          if (r) setItemRarity(r)
          if (t) setItemType(t)
          if (!r && !t) {
            setItemRarity(undefined)
            setItemType(undefined)
          }
        }}
      />
      <div style={{ marginTop: 10 }}>
        {weapons.length > 0 && (
          <span
            style={{
              fontFamily: 'monospace',
              fontWeight: 'bold',
              color: 'rgba(255,255,255,0.24)',
              marginBottom: 2,
            }}
          >
            WEAPONS
          </span>
        )}
        <FlexContainer
          style={{
            flexWrap: 'wrap',
            width: 400,
          }}
        >
          {weapons.map((item) => (
            <Item
              key={item.id}
              item={item}
              rawCharacter={rawCharacter}
              onEquip={(id) => equipItem(rawCharacter.id, id)}
            />
          ))}
        </FlexContainer>
        {armors.length > 0 && (
          <span
            style={{
              fontFamily: 'monospace',
              fontWeight: 'bold',
              color: 'rgba(255,255,255,0.24)',
              marginBottom: 2,
            }}
          >
            ARMOR
          </span>
        )}
        <FlexContainer
          style={{
            flexWrap: 'wrap',
            width: 400,
          }}
        >
          {armors.map((item) => (
            <Item
              key={item.id}
              item={item}
              rawCharacter={rawCharacter}
              onEquip={(id) => equipItem(rawCharacter.id, id)}
            />
          ))}
        </FlexContainer>
        {other.length > 0 && (
          <span
            style={{
              fontFamily: 'monospace',
              fontWeight: 'bold',
              color: 'rgba(255,255,255,0.24)',
              marginBottom: 2,
            }}
          >
            OTHER
          </span>
        )}
        <FlexContainer
          style={{
            flexWrap: 'wrap',
            width: 400,
          }}
        >
          {other.map((item) => (
            <Item
              key={item.id}
              item={item}
              rawCharacter={rawCharacter}
              onEquip={(id) => equipItem(rawCharacter.id, id)}
            />
          ))}
        </FlexContainer>
      </div>
    </FlexContainer>
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
    () => canEquip(rawCharacter)(item as EquippableT, !isWeapon),
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
  }, [item, isArmor, isEquipable, isWeapon, rarityColor])

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
          style={{
            width: 40,
            height: 40,
            background: !canEquipItem ? '#333' : '#222',
            boxShadow: `inset 0 0 ${!canEquipItem ? '3px' : '12px'} ${
              item.rarity !== 'common' && canEquipItem
                ? Color(rarityColor).fade(0.5).hsl().toString()
                : 'black'
            }`,
          }}
          substyle={{
            background: 'transparent',
            cursor: canEquipItem ? 'pointer' : 'default',
            borderColor: isHovering
              ? rarityColor
              : item.rarity === 'common'
              ? '#555'
              : Color(rarityColor).fade(0.5).hsl().toString(),
            boxShadow: canEquipItem ? 'inset 0 0 3px black' : 'none',
            display: 'flex',
            padding: 0,
            justifyContent: 'center',
            alignItems: 'center',
            margin: 0,
            opacity: canEquipItem ? 1 : 0.5,
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
