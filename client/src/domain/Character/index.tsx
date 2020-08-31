import React, { useMemo, useEffect } from 'react'
import { FlexContainer } from '../../elements/flex'
import { ResourceScore } from '../../components/ResourceScore'
import { AbilityScore } from '../../components/AbilityScore'
import { StatScore } from '../../components/StatScore'
import { DamageResistanceScore } from '../../components/DamageResistanceScore'
import { ArmorScoreList } from '../../components/ArmorScoreList'
import { ItemPreview } from '../../components/ItemPreview'
import { WeaponPreview } from '../../components/WeaponPreview'
import { CharacterDetails } from '../../components/CharacterDetails'
import { CharacterStateContextProvider } from '../../contexts/CharacterContext'
import { RollStateContextProvider } from '../../contexts/RollContext'
import { useParams, useHistory } from 'react-router'
import { usePartyContext } from '../../contexts/PartyContext'
import { useUIContext } from '../../contexts/UIContext'
import { SkillPreviewAlt } from '../../components/SkillPreviewAlt'
import { BASIC_ATTACK, INSPECT } from '../../objects/makeSkill'
import { BoxContainer } from '../../elements/box'
import { CharacterHeader } from '../../components/CharacterHeader'
import BG from '../../assets/img/forest-931706_1920.jpg'
import { Monospace } from '../../elements/monospace'

export const Character = () => {
  const { id } = useParams()
  const history = useHistory()
  const { rawUserParty, setActiveCharacterId } = usePartyContext()
  const { setLogKey, setSidebarKey } = useUIContext()
  const character = useMemo(() => {
    return rawUserParty.characters.find((c) => c.id === id)
  }, [id, rawUserParty])
  useEffect(() => {
    if (!character) {
      history.push(`/characters/${rawUserParty.characters[0].id}`)
    } else {
      setActiveCharacterId(character.id)
    }
  }, [id])

  useEffect(() => {
    setLogKey('items')
    return () => {
      setLogKey(undefined)
      setActiveCharacterId(null)
    }
  }, [])

  if (!character) return null
  return (
    <CharacterStateContextProvider>
      <RollStateContextProvider>
        <FlexContainer
          $direction='column'
          $full
          style={{
            background: `url(${BG}) center center`,
            backgroundSize: 'cover',
          }}
        >
          <CharacterHeader />
          <FlexContainer style={{ margin: 10, flex: 1 }}>
            <FlexContainer $direction='column' style={{ marginRight: 10 }}>
              <CharacterDetails showEdit={true} />
              <FlexContainer>
                <ResourceScore id='characterPoints' />
                <ResourceScore id='weaponHands' />
                <ResourceScore id='fingers' />
                <ResourceScore id='heads' />
                <ResourceScore id='bodies' />
                <ResourceScore id='hands' />
                <ResourceScore id='feet' />
              </FlexContainer>
              <FlexContainer>
                <FlexContainer $direction='column'>
                  <AbilityScore id='strength' />
                  <AbilityScore id='dexterity' />
                  <AbilityScore id='intelligence' />
                  <AbilityScore id='vigor' />
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
              <BoxContainer
                substyle={{
                  width: 320,
                  padding: '4px 8px',
                  boxShadow: 'inset 0px 0px 10px black',
                }}
              >
                <Monospace
                  style={{
                    fontWeight: 'bold',
                    color: 'rgba(255,255,255,0.24)',
                    background: '#222',
                    marginBottom: 2,
                    fontSize: 14,
                  }}
                >
                  SKILLS
                </Monospace>
                <FlexContainer style={{ flexWrap: 'wrap' }}>
                  {character.skills
                    .filter(
                      (s) => s.id !== BASIC_ATTACK.id && s.id !== INSPECT.id,
                    )
                    .map((skill) => (
                      <div style={{ padding: 2.5 }}>
                        <SkillPreviewAlt key={skill.id} skill={skill} />
                      </div>
                    ))}
                </FlexContainer>
              </BoxContainer>
            </FlexContainer>
            <FlexContainer>
              <div style={{ marginRight: 10 }}>
                <WeaponPreview showEquipButton={true} showRequirement={false} />
                {character.equippedItems.map((item) => (
                  <ItemPreview
                    key={item.id}
                    item={item}
                    showRequirementCheck={false}
                    showCollapseButton={false}
                  />
                ))}
              </div>
              <ArmorScoreList />
            </FlexContainer>
          </FlexContainer>
        </FlexContainer>
      </RollStateContextProvider>
    </CharacterStateContextProvider>
  )
}
