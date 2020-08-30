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
        <FlexContainer $direction='column' $full>
          <CharacterHeader />
          <FlexContainer style={{ margin: 10, flex: 1 }}>
            <FlexContainer $direction='column' style={{ marginRight: 10 }}>
              <CharacterDetails showEdit={true} />
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
                  <StatScore id='agility' />
                  <StatScore id='accuracy' />
                  <StatScore id='evade' />
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
            <FlexContainer>
              <div>
                <WeaponPreview showEquipButton={true} showRequirement={false} />
                {character.equippedItems.map((item) => (
                  <ItemPreview
                    key={item.id}
                    item={item}
                    showRequirementCheck={false}
                    showCollapseButton={false}
                  />
                ))}
                <BoxContainer
                  substyle={{
                    width: 320,
                    // padding: 28,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontWeight: 'bold',
                      color: 'rgba(255,255,255,0.24)',
                      marginBottom: 2,
                    }}
                  >
                    SKILLS
                  </span>
                  <FlexContainer style={{ flexWrap: 'wrap' }}>
                    {character.skills
                      .filter(
                        (s) => s.id !== BASIC_ATTACK.id && s.id !== INSPECT.id,
                      )
                      .map((skill) => (
                        <div style={{ padding: 3.5 }}>
                          <SkillPreviewAlt key={skill.id} skill={skill} />
                        </div>
                      ))}
                  </FlexContainer>
                </BoxContainer>
              </div>
              <ArmorScoreList />
            </FlexContainer>
          </FlexContainer>
        </FlexContainer>
      </RollStateContextProvider>
    </CharacterStateContextProvider>
  )
}
