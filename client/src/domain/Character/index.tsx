import React, { useMemo } from 'react'
import { FlexContainer } from '../../elements/flex'
import { ResourceScore } from '../../components/ResourceScore'
import { AbilityScore } from '../../components/AbilityScore'
import { StatScore } from '../../components/StatScore'
import { DamageResistanceScore } from '../../components/DamageResistanceScore'
import { ArmorScoreList } from '../../components/ArmorScoreList'
import { ItemPreview } from '../../components/ItemPreview'
import { useCharacterContext } from '../../contexts/CharacterContext'
import { WeaponPreview } from '../../components/WeaponPreview'
import { CharacterDetails } from '../../components/CharacterDetails'
import { CharacterStateContextProvider } from '../../contexts/CharacterContext'
import { RollStateContextProvider } from '../../contexts/RollContext'
import { useParams } from 'react-router'
import { usePartyContext } from '../../contexts/PartyContext'

export const Character = () => {
  const { id } = useParams()
  const { rawUserParty, updateCharacter } = usePartyContext()
  const character = useMemo(() => {
    const char = rawUserParty.characters.find((c) => c.id === id)
    return char || rawUserParty.characters[0]
  }, [id, rawUserParty])
  return (
    <CharacterStateContextProvider characterId={id}>
      <RollStateContextProvider>
        <FlexContainer style={{ margin: 10, flex: 1 }}>
          <FlexContainer $direction='column' style={{ marginRight: 10 }}>
            <CharacterDetails />
            <FlexContainer>
              <div>
                <ResourceScore id='characterPoints' />
                <ResourceScore id='weaponHands' />
                <ResourceScore id='heads' />
                <ResourceScore id='bodies' />
                <ResourceScore id='hands' />
                <ResourceScore id='fingers' />
                <ResourceScore id='feet' />
              </div>
              <div>
                <AbilityScore id='strength' />
                <AbilityScore id='dexterity' />
                <AbilityScore id='intelligence' />
                <AbilityScore id='vigor' />
              </div>
              <div>
                <StatScore id='health' />
                <StatScore id='focus' />
                <StatScore id='will' />
                <StatScore id='perception' />
                <StatScore id='lift' />
                <StatScore id='agility' />
              </div>
              <div>
                <DamageResistanceScore id='slashing' />
                <DamageResistanceScore id='piercing' />
                <DamageResistanceScore id='fire' />
                <DamageResistanceScore id='blood' />
                <DamageResistanceScore id='light' />
                <DamageResistanceScore id='dark' />
              </div>
            </FlexContainer>
          </FlexContainer>
          <FlexContainer style={{ marginRight: 10 }}>
            <div>
              <WeaponPreview
                weapon={character.weapon}
                showEquipButton={true}
                showRequirement={false}
              />
              {character.equippedItems.map((item) => (
                <ItemPreview
                  key={item.id}
                  item={item}
                  showRequirementCheck={false}
                  showCollapseButton={true}
                />
              ))}
            </div>
            <ArmorScoreList />
          </FlexContainer>
        </FlexContainer>
      </RollStateContextProvider>
    </CharacterStateContextProvider>
  )
}
