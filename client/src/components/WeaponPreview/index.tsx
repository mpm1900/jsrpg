import React, { useEffect } from 'react'
import Color from 'color'
import { useCharacterContext } from '../../contexts/CharacterContext'
import { CheckPreview } from '../CheckPreview'
import { TraitScore } from '../TraitScore'
import { WeaponT, WeaponEventsTypeMap } from '../../types/Weapon'
import { DamageRollScores, DamageRollScore } from '../DamageRollScores'
import { BoxContainer, BoxButton } from '../../elements/box'
import { FlexContainer, FullContainer } from '../../elements/flex'
import { WeaponIcon } from '../WeaponIcon'
import {
  combineTraits,
  CharacterSkillCheckKeyT,
  CharacterTraitT,
} from '../../types/Character'
import { CompareResultFn, ZERO_COMPARE, BASE_ARGS } from '../../util/compare'
import { DamageTypeKeyT } from '../../types/Damage'
import { Icon } from '../Icon'
import { IconCharacterResourceMap } from '../../icons/maps'
import { FISTS } from '../../objects/fists'
import { ItemRarityColorMap } from '../../types/Item'
import { usePartyContext } from '../../contexts/PartyContext'
import { getKeys } from '../../util/getKeys'
import {
  getRollText,
  getRollRange,
  reduceCharacterRoll,
} from '../../types/Roll2'

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
  const { unequipItem } = usePartyContext()
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
          <BoxButton
            substyle={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => unequipItem(rawCharacter.id, weapon.id)}
          >
            <Icon
              src={IconCharacterResourceMap[weapon.resource]}
              size={12}
              fill='rgba(255,255,255,0.8)'
              style={{ marginRight: 10 }}
            />
            {weapon.cost}
          </BoxButton>
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
      <div style={{ marginBottom: 10 }}>
        {getKeys(weapon.events).map((key) => (
          <FlexContainer key={key} style={{ alignItems: 'center' }}>
            <strong
              style={{
                fontFamily: 'monospace',
                marginRight: 10,
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              {WeaponEventsTypeMap[key]}:
            </strong>
            <TraitScore
              trait={combineTraits(weapon.events[key] as CharacterTraitT[])}
            />
          </FlexContainer>
        ))}
      </div>
      <DamageRollScores weapon={weapon}>
        {(values, combinedRoll) => (
          <>
            <span
              style={{
                fontFamily: 'monospace',
                color: 'rgba(255,255,255,0.25)',
              }}
            >
              ({getRollRange(reduceCharacterRoll(combinedRoll, character))}){' '}
              {getRollText(combinedRoll)}
            </span>
            {values.map((value) => (
              <DamageRollScore
                key={value.id}
                id={value.id}
                damageRangeText={value.damageRangeText}
                damageRollText={value.damageRollText}
                compareResult={damageCompare(value.id)}
              />
            ))}
          </>
        )}
      </DamageRollScores>
    </BoxContainer>
  )
}
