import React from 'react'
import { FlexContainer } from '../../elements/flex'
import { AbilityScore } from '../AbilityScore'
import { StatScore } from '../StatScore'
import { DamageResistanceScore } from '../DamageResistanceScore'

export const CharacterInspect = () => {
  return (
    <FlexContainer>
      <FlexContainer $direction='column'>
        <AbilityScore id='strength' edit={false} />
        <AbilityScore id='dexterity' edit={false} />
        <AbilityScore id='intelligence' edit={false} />
        <AbilityScore id='vigor' edit={false} />
      </FlexContainer>
      <FlexContainer $direction='column'>
        <StatScore id='health' />
        <StatScore id='focus' />
        <StatScore id='will' />
        <StatScore id='perception' />
        <StatScore id='lift' />
        <StatScore id='agility' />
      </FlexContainer>
      <FlexContainer $direction='column'>
        <DamageResistanceScore id='slashing' />
        <DamageResistanceScore id='piercing' />
        <DamageResistanceScore id='fire' />
        <DamageResistanceScore id='blood' />
        <DamageResistanceScore id='light' />
        <DamageResistanceScore id='dark' />
      </FlexContainer>
    </FlexContainer>
  )
}
