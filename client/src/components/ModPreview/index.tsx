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
import { getSign } from '../../util/getSign'
import { Monospace } from '../../elements/monospace'

export interface ModPreviewPropsT {
  mod: WeaponModT
  showEquipButton?: boolean
  onEquip?: (modId: string) => void
}
export const ModPreview = (props: ModPreviewPropsT) => {
  const { mod, showEquipButton, onEquip } = props
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
        {showEquipButton && (
          <BoxButton onClick={() => onEquip && onEquip(mod.id)}>
            equip
          </BoxButton>
        )}
      </FlexContainer>
      {weaponTrait.accuracyOffset !== 0 && (
        <Monospace style={{ marginTop: 10, fontSize: 14 }}>
          {getSign(weaponTrait.accuracyOffset)}
          {Math.abs(weaponTrait.accuracyOffset)} to hit
        </Monospace>
      )}
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
