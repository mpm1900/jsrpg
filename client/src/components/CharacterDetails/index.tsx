import React, { useState } from 'react'
import Tooltip from 'react-tooltip-lite'
import Inspect from '../../icons/svg/lorc/magnifying-glass.svg'
import WeaponHands from '../../icons/svg/delapouite/sword-brandish.svg'
import { useCharacterContext } from '../../contexts/CharacterContext'
import { BoxContainer, SmallBox } from '../../elements/box'
import { FlexContainer } from '../../elements/flex'
import { Gauge } from '../Gauge'
import { CharacterInspect } from '../CharacterInspect'
import { Icon } from '../Icon'
import { ProcessedCharacterT } from '../../types/Character'
import { WeaponPreview } from '../WeaponPreview'

export interface CharacterDetailsPropsT {
  character?: ProcessedCharacterT
}
export const CharacterDetails = (props: CharacterDetailsPropsT) => {
  const characterContext = useCharacterContext()
  const character = props.character || characterContext.character
  const [detailsHovering, setDetailsHovering] = useState(false)
  const [weaponHovering, setWeaponHovering] = useState(false)
  const health = character.stats.health - character.healthOffset
  return (
    <BoxContainer style={{ minWidth: 430 }}>
      <FlexContainer $direction='column'>
        <FlexContainer style={{ marginBottom: 10 }}>
          <FlexContainer $full>
            <BoxContainer
              style={{ marginRight: 10, height: 64, width: 64 }}
              substyle={{ padding: 0 }}
            >
              <img
                alt='profile'
                src='https://picsum.photos/60/60'
                style={{ height: 60, width: 60 }}
              />
            </BoxContainer>
            <FlexContainer $direction='column'>
              <h2 style={{ margin: 0 }}>{character.name}</h2>
              <strong>Power: {character.power}</strong>
            </FlexContainer>
          </FlexContainer>
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
        </FlexContainer>
        <Gauge
          name='Health'
          color='#8f4e4d'
          max={character.stats.health}
          value={health > 0 ? health : 0}
          height={10}
        ></Gauge>
        <Gauge
          name='Focus'
          color='#517e4e'
          max={character.stats.focus}
          value={character.stats.focus}
          height={5}
        ></Gauge>
      </FlexContainer>
    </BoxContainer>
  )
}
