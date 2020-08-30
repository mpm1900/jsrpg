import React from 'react'
import { useCharacterContext } from '../../contexts/CharacterContext'
import { CharacterStatKeyT } from '../../types/Character'
import { useRollContext } from '../../contexts/RollContext'
import { BoxContainer } from '../../elements/box'
import { makeCharacterCheck } from '../../types/Roll2'

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
        background: '#222',
        boxShadow: 'inset 3px 0px 10px black',
      }}
    >
      <strong
        style={{
          color: 'rgba(255,255,255,0.5)',
          textShadow: '1px 1px 0px black',
          display: 'inline-block',
          flex: 1,
          marginRight: 10,
        }}
        // onClick={() => execCheck(makeCharacterCheck([id]))}
      >
        {displayName.toLocaleUpperCase()}
      </strong>
      <span style={{ fontWeight: 'bolder' }}>{character.stats[id]}</span>
    </BoxContainer>
  )
}
