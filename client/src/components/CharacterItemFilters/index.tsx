import React from 'react'
import Color from 'color'
import { BoxContainer } from '../../elements/box'
import { ItemRarityT, ItemRarityColorMap } from '../../types/Item'
import { FlexContainer } from '../../elements/flex'

export interface CharacterItemFilters {
  onClick: (rarity: ItemRarityT) => void
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
    </FlexContainer>
  )
}

export interface CharacterItemFilterButtonPropsT {
  rarity: ItemRarityT
  onClick: (rarity: ItemRarityT) => void
}
export const CharacterItemFilterButton = (
  props: CharacterItemFilterButtonPropsT,
) => {
  const { rarity, onClick } = props
  return (
    <BoxContainer
      style={{ width: 40, height: 40 }}
      substyle={{
        backgroundColor: Color(ItemRarityColorMap[rarity])
          .fade(0.75)
          .hsl()
          .toString(),
        cursor: 'pointer',
        borderColor: Color(ItemRarityColorMap[rarity])
          .fade(0.5)
          .hsl()
          .toString(),
        boxShadow: 'inset 0 0 3px black',
        display: 'flex',
        padding: 0,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onClick={() => onClick(rarity)}
    ></BoxContainer>
  )
}
