import React, { useState, useEffect } from 'react'
import Tooltip from 'react-tooltip-lite'
import Inspect from '../../icons/svg/lorc/magnifying-glass.svg'
import WeaponHands from '../../icons/svg/delapouite/sword-brandish.svg'
import { useCharacterContext } from '../../contexts/CharacterContext'
import { BoxContainer, SmallBox, BoxButton } from '../../elements/box'
import { FlexContainer, FullContainer } from '../../elements/flex'
import { Gauge } from '../Gauge'
import { CharacterInspect } from '../CharacterInspect'
import { Icon } from '../Icon'
import { ProcessedCharacterT } from '../../types/Character'
import { WeaponPreview } from '../WeaponPreview'
import Tombstone from '../../icons/svg/lorc/tombstone.svg'
import Pencil from '../../icons/svg/delapouite/pencil.svg'
import Save from '../../icons/svg/delapouite/save.svg'
import Delete from '../../icons/svg/delapouite/trash-can.svg'
import { usePartyContext } from '../../contexts/PartyContext'
import { noneg } from '../../util/noneg'
import { CombatCharacterSkills } from '../CombatCharacterSkills'
import { CombatCharacterTargets } from '../CombatCharacterTargets'
import { useCombatContext } from '../../contexts/CombatContext'
import { HoverToolTip } from '../Tooltip'

export interface CharacterDetailsPropsT {
  character?: ProcessedCharacterT
  showInspect?: boolean
  showWeaponInspect?: boolean
  showEdit?: boolean
  showSkills?: boolean
  width?: number
}
export const CharacterDetails = (props: CharacterDetailsPropsT) => {
  const {
    showEdit = false,
    showInspect = false,
    showWeaponInspect = false,
    showSkills = false,
    width,
  } = props
  const characterContext = useCharacterContext()
  const { deleteCharacter } = usePartyContext()
  const {
    characterSkills,
    setCharacterSkill,
    characterTargets,
    setCharacterTarget,
  } = useCombatContext()
  const { rawCharacter, onChange } = characterContext
  const character = props.character || characterContext.character
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState<string>(character.name)
  const health = noneg(character.stats.health - character.healthOffset)
  const focus = noneg(character.stats.focus - character.focusOffset)
  useEffect(() => {
    setName(character.name)
  }, [character.name])
  return (
    <BoxContainer
      style={{
        minWidth: width || 350,
        transition: 'all 1s',
        border: '2px solid black',
      }}
      substyle={{
        padding: 0,
      }}
    >
      <FlexContainer $direction='column'>
        <FlexContainer
          style={{
            padding: 4,
            background:
              'linear-gradient(0deg, rgba(34,34,34,1) 0%, rgba(51,51,51,1) 100%)',
          }}
        >
          <FlexContainer $full>
            <BoxContainer
              style={{
                marginRight: 10,
                height: 64,
                width: 64,
              }}
              substyle={{
                padding: 0,
                backgroundColor: '#111',
                border: 'none',
              }}
            >
              {character.dead ? (
                <FlexContainer
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 60,
                  }}
                >
                  <Icon src={Tombstone} size={48} />
                </FlexContainer>
              ) : (
                <img
                  alt='profile'
                  src={`https://picsum.photos/seed/${character.name}/60/60`}
                  style={{
                    height: 60,
                    width: 60,
                    border: '1px solid rgba(255,255,255,0.5)',
                  }}
                />
              )}
            </BoxContainer>

            {isEditing ? (
              <div>
                <input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            ) : (
              <FlexContainer $direction='column'>
                <h2
                  style={{
                    margin: 0,
                    textShadow: '1px 1px 1px black',
                    fontSize: 18,
                  }}
                >
                  {character.name}
                </h2>
                <FullContainer />
                <strong
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 10,
                    color: 'rgba(255,255,255,0.24)',
                  }}
                >
                  {character.abilities.strength} {character.abilities.dexterity}{' '}
                  {character.abilities.intelligence} {character.abilities.vigor}
                </strong>
                <strong
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 10,
                    color: 'rgba(255,255,255,0.24)',
                  }}
                >
                  {character.stats.will} {character.stats.perception}{' '}
                  {character.stats.agility} {character.stats.accuracy}{' '}
                  {character.stats.evade}
                </strong>
              </FlexContainer>
            )}
          </FlexContainer>
          {showWeaponInspect && (
            <HoverToolTip
              direction='right'
              content={<WeaponPreview weapon={character.weapon} />}
            >
              <SmallBox>
                <Icon src={WeaponHands} size={18} />
              </SmallBox>
            </HoverToolTip>
          )}
          {showInspect && (
            <HoverToolTip direction='right' content={<CharacterInspect />}>
              <SmallBox>
                <Icon src={Inspect} size={18} />
              </SmallBox>
            </HoverToolTip>
          )}
          {showEdit && !isEditing && (
            <BoxButton
              style={{ height: 42, width: 42, margin: 0 }}
              substyle={{
                padding: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onClick={() => setIsEditing((e) => !e)}
            >
              <Icon src={Pencil} size={18} />
            </BoxButton>
          )}
          {isEditing && (
            <>
              <BoxButton
                style={{ height: 42, width: 42, margin: 0 }}
                substyle={{
                  padding: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onClick={() => {
                  onChange({ ...rawCharacter, name })
                  setIsEditing((e) => !e)
                }}
              >
                <Icon src={Save} size={18} />
              </BoxButton>
              <BoxButton
                style={{ height: 42, width: 42, margin: 0 }}
                substyle={{
                  padding: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onClick={() => {
                  deleteCharacter(character.id)
                }}
              >
                <Icon src={Delete} size={18} />
              </BoxButton>
            </>
          )}
        </FlexContainer>
        {showSkills && (
          <FlexContainer
            $direction='column'
            style={{
              backgroundColor: '#1a1a1a',
              boxShadow: 'inset 0px 0px 15px black',
              width: 'calc(100% - 16px)',
              padding: '4px 8px',
              borderTop: '1px solid #555',
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
            <CombatCharacterSkills
              activeSkillId={characterSkills[character.id]}
              skills={character.skills}
              onClick={(skillId) => setCharacterSkill(character.id, skillId)}
            />
            <span
              style={{
                fontFamily: 'monospace',
                fontWeight: 'bold',
                color: 'rgba(255,255,255,0.24)',
                marginBottom: 2,
                marginTop: 4,
              }}
            >
              TARGETS
            </span>
            <CombatCharacterTargets
              activeTargetId={characterTargets[character.id]}
              onClick={(targetId) => setCharacterTarget(character.id, targetId)}
            />
          </FlexContainer>
        )}
        <Gauge
          name='Health'
          color='#8f4e4d'
          max={character.stats.health}
          value={health}
          height={15}
        >
          {health}/{character.stats.health}
        </Gauge>
        <Gauge
          name='Focus'
          color='#517e4e'
          max={character.stats.focus}
          value={focus}
          height={15}
        >
          {focus}/{character.stats.focus}
        </Gauge>
      </FlexContainer>
    </BoxContainer>
  )
}
