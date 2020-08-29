import React from 'react'
import { FlexContainer } from '../../elements/flex'
import { AbilityScore } from '../AbilityScore'
import { StatScore } from '../StatScore'
import { DamageResistanceScore } from '../DamageResistanceScore'
import { WeaponPreview } from '../WeaponPreview'
import { useCharacterContext } from '../../contexts/CharacterContext'

export const CharacterInspect = () => {
  const { character } = useCharacterContext()
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
        <StatScore id='agility' />
        <StatScore id='accuracy' />
        <StatScore id='evade' />
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
