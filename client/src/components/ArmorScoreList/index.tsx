import React from 'react'
import { useCharacterContext } from '../../contexts/CharacterContext'
import { ItemPreview } from '../ItemPreview'
import { ArmorTypeSortKey } from '../../types/Armor'
import { ItemPreviewSmall } from '../ItemPreviewSmall'
import { FlexContainer } from '../../elements/flex'
import { v4 } from 'uuid'
import { usePartyContext } from '../../contexts/PartyContext'

export interface ArmorScoreListPropsT {}
export const ArmorScoreList = (props: ArmorScoreListPropsT) => {
  const { character, rawCharacter } = useCharacterContext()
  const { unequipItem } = usePartyContext()
  const { armor } = character
  const rings = armor.filter((i) => i.armorType === 'ring')
  const arr = Array(10 - rings.length).fill(undefined)
  return (
    <div>
      <FlexContainer>
        {[...arr, ...rings].map((item) => (
          <ItemPreviewSmall
            key={item ? item.id : v4()}
            item={item}
            onClick={(item) => unequipItem(rawCharacter.id, item.id)}
          />
        ))}
      </FlexContainer>
      {armor
        .filter((i) => i.armorType !== 'ring')
        .sort(
          (a, b) =>
            ArmorTypeSortKey[a.armorType] - ArmorTypeSortKey[b.armorType],
        )
        .map((item) => (
          <ItemPreview
            key={item.id}
            item={item}
            showRequirementCheck={false}
            showCollapseButton={false}
          />
        ))}
    </div>
  )
}
