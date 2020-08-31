import React from 'react'
import { CharacterResourceKeyT } from '../../types/Character'
import { useCharacterContext } from '../../contexts/CharacterContext'
import { IconCharacterResourceMap } from '../../icons/maps'
import { Icon } from '../Icon'
import { BoxContainer } from '../../elements/box'
import { Monospace } from '../../elements/monospace'

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
        fontSize: 16,
        background: '#1a1a1a',
        color: 'rgba(255,255,255,0.6)',
      }}
    >
      <div style={{ flex: 1, marginRight: 10 }}>
        <Icon size={18} src={iconUrl} fill='rgba(255,255,255,0.8)' />
      </div>
      <Monospace>{character.resources[id]}</Monospace>
    </BoxContainer>
  )
}
