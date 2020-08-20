import React, { useState } from 'react'
import { useCharacterContext } from '../../contexts/CharacterContext'
import { BoxContainer } from '../../elements/box'
import { FlexContainer } from '../../elements/flex'
import { Gauge } from '../Gauge'

export const CharacterDetails = () => {
  const { character } = useCharacterContext()
  const health = character.stats.health - character.healthOffset
  return (
    <BoxContainer>
      <FlexContainer $direction='column'>
        <FlexContainer style={{ marginBottom: 10 }}>
          <BoxContainer
            style={{ marginRight: 10, height: 64, width: 64 }}
            substyle={{ padding: 0 }}
          >
            <img
              src='https://picsum.photos/60/60'
              style={{ height: 60, width: 60 }}
            />
          </BoxContainer>
          <FlexContainer $direction='column'>
            <h2 style={{ margin: 0 }}>{character.name}</h2>
            <strong>Power: {character.power}</strong>
          </FlexContainer>
        </FlexContainer>
        <Gauge
          color='#8f4e4d'
          max={character.stats.health}
          value={health > 0 ? health : 0}
          height={10}
        ></Gauge>
        <Gauge
          color='#517e4e'
          max={character.stats.focus}
          value={character.stats.focus}
          height={5}
        ></Gauge>
      </FlexContainer>
    </BoxContainer>
  )
}
