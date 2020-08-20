import React from 'react'
import Color from 'color'
import { useCharacterContext } from '../../contexts/CharacterContext'
import { CheckPreview } from '../CheckPreview'
import { TraitScore } from '../TraitScore'
import { WeaponT } from '../../types/Weapon'
import { DamageRollScores, DamageRollScore } from '../DamageRollScores'
import { BoxContainer } from '../../elements/box'
import { FlexContainer, FullContainer } from '../../elements/flex'
import { WeaponIcon } from '../WeaponIcon'
import {
  combineTraits,
  CharacterSkillCheckKeyT,
  unequipItem,
} from '../../types/Character'
import { CompareResultFn, ZERO_COMPARE, BASE_ARGS } from '../../util/compare'
import { DamageTypeKeyT } from '../../types/Damage'
import { Icon } from '../Icon'
import { IconCharacterResourceMap } from '../../icons/maps'
import { FISTS } from '../../objects/fists'
import { ItemRarityColorMap } from '../../types/Item'

export interface WeaponPreviewPropsT {
  weapon?: WeaponT
  showEquipButton?: boolean
  showRequirement?: boolean
  requirementCompare?: CompareResultFn
  accuracyCompare?: CompareResultFn
  traitCompare?: (key: CharacterSkillCheckKeyT) => CompareResultFn
  damageCompare?: (key: DamageTypeKeyT) => CompareResultFn
  costComare?: CompareResultFn
}
export const WeaponPreview = (props: WeaponPreviewPropsT) => {
  const { character, rawCharacter, onChange } = useCharacterContext()
  const { showEquipButton = true, showRequirement = true } = props
  const weapon = props.weapon || character.weapon
  const rarityColor = ItemRarityColorMap[weapon.rarity]
  const borderColor = Color(rarityColor)
    .desaturate(0.5)
    .fade(0.5)
    .rgb()
    .string()
  const requirementCompare = props.requirementCompare || ZERO_COMPARE
  const accuracyCompare = props.accuracyCompare || ZERO_COMPARE
  const traitCompare = props.traitCompare || ((key) => ZERO_COMPARE)
  const damageCompare = props.damageCompare || ((key) => ZERO_COMPARE)
  const costComare = props.costComare || ZERO_COMPARE
  const trait = combineTraits(weapon.traits)
  return (
    <BoxContainer
      style={{ width: 380 }}
      substyle={{ borderColor: borderColor }}
    >
      <FlexContainer style={{ marginBottom: 10 }}>
        <WeaponIcon weapon={weapon} size={24} fill={rarityColor} />
        <h3 style={{ margin: '0 0 0 10px', flex: 1 }}>{weapon.name}</h3>
        {weapon.id !== FISTS.id && showEquipButton ? (
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => onChange(unequipItem(rawCharacter)(weapon.id))}
          >
            <Icon
              src={IconCharacterResourceMap[weapon.resource]}
              size={12}
              fill='#4bebc6'
              style={{ marginRight: 10 }}
            />
            {weapon.cost}
          </button>
        ) : (
          <FlexContainer
            style={{
              margin: '0 0 10px 0',
              fontWeight: 'bold',
              fontSize: 12,
              color: costComare(...BASE_ARGS),
            }}
          >
            <Icon
              src={IconCharacterResourceMap.weaponHands}
              size={12}
              style={{ margin: '0 8px' }}
              fill={costComare('lightcoral', 'white', 'lightgreen')}
            />
            {weapon.cost}
          </FlexContainer>
        )}
      </FlexContainer>

      <FlexContainer style={{ marginBottom: 10 }}>
        {showRequirement && (
          <FullContainer>
            <CheckPreview
              name='Requirement'
              showCheckButton={false}
              check={weapon.requirementCheck}
              compareResult={requirementCompare}
            />
          </FullContainer>
        )}
        <FullContainer>
          <CheckPreview
            name='Accuracy'
            showCheckButton={false}
            check={weapon.accuracyCheck}
            compareResult={accuracyCompare}
          />
        </FullContainer>
      </FlexContainer>
      <div style={{ marginBottom: 10 }}>
        <TraitScore trait={trait} compareResult={traitCompare} />
      </div>
      <DamageRollScores weapon={weapon}>
        {(values) =>
          values.map((value) => (
            <DamageRollScore
              key={value.id}
              id={value.id}
              damageRangeText={value.damageRangeText}
              damageRollText={value.damageRollText}
              compareResult={damageCompare(value.id)}
            />
          ))
        }
      </DamageRollScores>
    </BoxContainer>
  )
}
