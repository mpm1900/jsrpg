import React from 'react'
import { useCharacterContext } from '../../contexts/CharacterContext'
import { CharacterStatKeyT } from '../../types/Character'
import { useRollContext } from '../../contexts/RollContext'
import { BoxContainer } from '../../elements/box'

export interface StatScorePropsT {
  id: CharacterStatKeyT
}
export const StatScore = (props: StatScorePropsT) => {
  const { id } = props
  const { character } = useCharacterContext()
  const { execCheck } = useRollContext()
  const displayName = id //CharacterKeyMap3[id]
  return (
    <BoxContainer
      style={{ flex: 1 }}
      substyle={{
        display: 'flex',
        fontFamily: 'monospace',
        alignItems: 'center',
      }}
    >
      <a
        href='#'
        style={{ display: 'inline-block', flex: 1, marginRight: 10 }}
        onClick={() => execCheck({ keys: [id] })}
      >
        {displayName}
      </a>
      <span>{character.stats[id]}</span>
    </BoxContainer>
  )
}
