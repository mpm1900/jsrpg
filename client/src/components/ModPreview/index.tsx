import React from 'react'
import { BoxContainer, BoxButton } from '../../elements/box'
import { WeaponModT, combineWeaponTraits } from '../../types/Weapon'
import { Icon } from '../Icon'
import Mod from '../../icons/svg/lorc/emerald.svg'
import { FlexContainer } from '../../elements/flex'
import { combineTraits } from '../../types/Character'
import { DamageRollScores, DamageRollScore } from '../DamageRollScores'
import { useCharacterContext } from '../../contexts/CharacterContext'
import { TraitScore } from '../TraitScore'

export interface ModPreviewPropsT {
  mod: WeaponModT
}
export const ModPreview = (props: ModPreviewPropsT) => {
  const { mod } = props
  const { character } = useCharacterContext()
  const weaponTrait = combineWeaponTraits(...mod.traits)
  const trait = combineTraits(weaponTrait.traits)
  return (
    <BoxContainer>
      <FlexContainer>
        <Icon src={Mod} size={24} />
        <span
          style={{
            margin: '0 10px',
            flex: 1,
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
          }}
        >
          {mod.name}
        </span>
        <BoxButton>equip</BoxButton>
      </FlexContainer>
      <div style={{ marginBottom: 10 }}>
        <TraitScore trait={trait} />
      </div>
      <DamageRollScores parent={weaponTrait}>
        {(values, combinedRoll) =>
          values.map((value) => (
            <DamageRollScore
              key={value.id}
              id={value.id}
              damageRangeText={value.damageRangeText}
              damageRollText={value.damageRollText}
            />
          ))
        }
      </DamageRollScores>
    </BoxContainer>
  )
}
