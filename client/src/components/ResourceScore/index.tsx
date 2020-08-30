import React from 'react'
import { CharacterResourceKeyT } from '../../types/Character'
import { useCharacterContext } from '../../contexts/CharacterContext'
import { IconCharacterResourceMap } from '../../icons/maps'
import { Icon } from '../Icon'
import { BoxContainer } from '../../elements/box'

export interface ResourceScorePropsT {
  id: CharacterResourceKeyT
}
export const ResourceScore = (props: ResourceScorePropsT) => {
  const { id } = props
  const { character } = useCharacterContext()
  const iconUrl = IconCharacterResourceMap[id]

  return (
    <BoxContainer
      style={{ flex: 1 }}
      substyle={{
        display: 'flex',
        padding: 4,
        fontFamily: 'monospace',
        fontSize: 16,
      }}
    >
      <div style={{ flex: 1, marginRight: 10 }}>
        <Icon size={18} src={iconUrl} />
      </div>
      {character.resources[id]}
    </BoxContainer>
  )
}
