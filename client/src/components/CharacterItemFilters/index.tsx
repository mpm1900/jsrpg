import React from 'react'
import Color from 'color'
import { BoxContainer } from '../../elements/box'
import { ItemRarityT, ItemRarityColorMap, ItemTypeT } from '../../types/Item'
import { FlexContainer } from '../../elements/flex'

export interface CharacterItemFilters {
  onClick: (rarity?: ItemRarityT, type?: ItemTypeT) => void
}
export const CharacterItemFilters = (props: CharacterItemFilters) => {
  const { onClick } = props
  return (
    <FlexContainer>
      <CharacterItemFilterButton rarity='common' onClick={onClick} />
      <CharacterItemFilterButton rarity='uncommon' onClick={onClick} />
      <CharacterItemFilterButton rarity='rare' onClick={onClick} />
      <CharacterItemFilterButton rarity='legendary' onClick={onClick} />
      <CharacterItemFilterButton rarity='unique' onClick={onClick} />
      <CharacterItemFilterButton rarity='mythic' onClick={onClick} />
      <CharacterItemFilterButton rarity='set' onClick={onClick} />
      <CharacterItemFilterButton type='weapon' onClick={onClick}>
        W
      </CharacterItemFilterButton>
      <CharacterItemFilterButton type='armor' onClick={onClick}>
        A
      </CharacterItemFilterButton>
      <CharacterItemFilterButton onClick={onClick}>R</CharacterItemFilterButton>
    </FlexContainer>
  )
}

export interface CharacterItemFilterButtonPropsT {
  rarity?: ItemRarityT
  type?: ItemTypeT
  children?: React.ReactNode | React.ReactNode[]
  onClick: (rarity?: ItemRarityT, type?: ItemTypeT) => void
}
export const CharacterItemFilterButton = (
  props: CharacterItemFilterButtonPropsT,
) => {
  const { rarity, type, children, onClick } = props
  const backgroundColor = rarity
    ? Color(ItemRarityColorMap[rarity]).fade(0.75).hsl().toString()
    : '#222'
  const borderColor = rarity
    ? Color(ItemRarityColorMap[rarity]).fade(0.5).hsl().toString()
    : '#555'
  return (
    <BoxContainer
      tag='button'
      style={{ width: 40, height: 40 }}
      substyle={{
        backgroundColor: backgroundColor,
        cursor: 'pointer',
        borderColor: borderColor,
        boxShadow: 'inset 0 0 3px black',
        display: 'flex',
        padding: 0,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
      }}
      onClick={() => onClick(rarity, type)}
    >
      {children}
    </BoxContainer>
  )
}
