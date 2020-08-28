import React, { useState, useEffect } from 'react'
import Tooltip from 'react-tooltip-lite'
import Inspect from '../../icons/svg/lorc/magnifying-glass.svg'
import WeaponHands from '../../icons/svg/delapouite/sword-brandish.svg'
import { useCharacterContext } from '../../contexts/CharacterContext'
import { BoxContainer, SmallBox, BoxButton } from '../../elements/box'
import { FlexContainer } from '../../elements/flex'
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

export interface CharacterDetailsPropsT {
  character?: ProcessedCharacterT
  showInspect?: boolean
  showWeaponInspect?: boolean
  showEdit?: boolean
}
export const CharacterDetails = (props: CharacterDetailsPropsT) => {
  const {
    showEdit = false,
    showInspect = false,
    showWeaponInspect = false,
  } = props
  const characterContext = useCharacterContext()
  const { deleteCharacter } = usePartyContext()
  const { rawCharacter, onChange } = characterContext
  const character = props.character || characterContext.character
  const [detailsHovering, setDetailsHovering] = useState(false)
  const [weaponHovering, setWeaponHovering] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState<string>(character.name)
  const health = character.stats.health - character.healthOffset
  const focus = character.stats.focus - character.focusOffset
  useEffect(() => {
    setName(character.name)
  }, [character.name])
  return (
    <BoxContainer
      style={{
        minWidth: 430,
        opacity: character.dead ? 0.5 : 1,
        transition: 'all 1s',
      }}
    >
      <FlexContainer $direction='column'>
        <FlexContainer style={{ marginBottom: 10 }}>
          <FlexContainer $full>
            <BoxContainer
              style={{
                marginRight: 10,
                height: 64,
                width: 64,
              }}
              substyle={{ padding: 0, backgroundColor: '#111' }}
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
                  src='https://picsum.photos/60/60'
                  style={{ height: 60, width: 60 }}
                />
              )}
            </BoxContainer>

            {isEditing ? (
              <div>
                <input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            ) : (
              <FlexContainer $direction='column'>
                <h2 style={{ margin: 0 }}>{character.name}</h2>
                <strong>Power: {character.power}</strong>
              </FlexContainer>
            )}
          </FlexContainer>
          {showWeaponInspect && (
            <Tooltip
              isOpen={detailsHovering}
              direction='right'
              tagName='div'
              padding='0'
              arrow={false}
              content={<WeaponPreview weapon={character.weapon} />}
            >
              <SmallBox
                onMouseEnter={() => setDetailsHovering(true)}
                onMouseLeave={() => setDetailsHovering(false)}
              >
                <Icon src={WeaponHands} size={18} />
              </SmallBox>
            </Tooltip>
          )}
          {showInspect && (
            <Tooltip
              isOpen={weaponHovering}
              direction='right'
              tagName='div'
              padding='0'
              arrow={false}
              content={<CharacterInspect />}
            >
              <SmallBox
                onMouseEnter={() => setWeaponHovering(true)}
                onMouseLeave={() => setWeaponHovering(false)}
              >
                <Icon src={Inspect} size={18} />
              </SmallBox>
            </Tooltip>
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
        <Gauge
          name='Health'
          color='#8f4e4d'
          max={character.stats.health}
          value={noneg(health)}
          height={10}
        ></Gauge>
        <Gauge
          name='Focus'
          color='#517e4e'
          max={character.stats.focus}
          value={noneg(focus)}
          height={5}
        ></Gauge>
      </FlexContainer>
    </BoxContainer>
  )
}
