import React from 'react'
import Color from 'color'
import { useCharacterContext } from '../../contexts/CharacterContext'
import { CheckPreview } from '../CheckPreview'
import { TraitScore } from '../TraitScore'
import { WeaponT } from '../../types/Weapon'
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
import { EventsTypeMap } from '../../types/Events'
import { ModPreview } from '../ModPreview'
import Mod from '../../icons/svg/lorc/emerald.svg'
import { Hover } from '../Hover'
import Tooltip from 'react-tooltip-lite'
import { HoverToolTip } from '../Tooltip'

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
  const { unequipItem, unequipMod } = usePartyContext()
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
      substyle={{ borderColor: borderColor, padding: 0 }}
    >
      <FlexContainer
        style={{
          padding: 8,
          background: 'linear-gradient(0deg, #222222 0%, #2a2a2a 100%)',
          borderBottom: '1px solid #555',
        }}
      >
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
      <div
        style={{
          padding: 8,
          background: '#222',
          boxShadow: 'inset 0px 0px 15px black',
        }}
      >
        <div style={{ padding: '8px 8px 0px 8px' }}>
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
            {getKeys(weapon.events || {}).map(
              (key) =>
                (weapon.events[key] || []).length > 0 && (
                  <FlexContainer key={key} style={{ alignItems: 'center' }}>
                    <strong
                      style={{
                        fontFamily: 'monospace',
                        marginRight: 10,
                        color: 'rgba(255,255,255,0.5)',
                      }}
                    >
                      {EventsTypeMap[key]}:
                    </strong>
                    <TraitScore
                      trait={combineTraits(
                        weapon.events[key] as CharacterTraitT[],
                      )}
                    />
                  </FlexContainer>
                ),
            )}
          </div>
        </div>
        {weapon.slotCount > 0 && (
          <FlexContainer
            style={{
              justifyContent: 'center',
              padding: 8,
              margin: '8px 0 4px 0',
            }}
          >
            <FullContainer>
              <hr
                style={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  borderBottomWidth: 0,
                }}
              />
            </FullContainer>
            <FlexContainer style={{ padding: '0 20px' }}>
              {Array(weapon.slotCount)
                .fill(null)
                .map((_, i) => {
                  const mod = weapon.slots[i]
                  if (mod) {
                    return (
                      <HoverToolTip content={<ModPreview mod={mod} />}>
                        <Icon
                          src={Mod}
                          size={20}
                          fill={ItemRarityColorMap[mod.rarity]}
                          style={{
                            padding: '0 8px',
                            cursor: 'pointer',
                          }}
                          onClick={() => {
                            unequipMod(character.id, mod.id)
                          }}
                        />
                      </HoverToolTip>
                    )
                  } else {
                    return (
                      <Icon
                        src={Mod}
                        size={20}
                        fill='rgba(255,255,255,0.4)'
                        style={{ padding: '0 8px' }}
                      />
                    )
                  }
                })}
            </FlexContainer>
            <FullContainer>
              <hr
                style={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  borderBottomWidth: 0,
                }}
              />
            </FullContainer>
          </FlexContainer>
        )}
        <DamageRollScores parent={weapon}>
          {(values, combinedRoll) => (
            <>
              <span
                style={{
                  fontFamily: 'monospace',
                  color: 'rgba(255,255,255,0.25)',
                }}
              >
                TOTAL DAMAGE: (
                {getRollRange(reduceCharacterRoll(combinedRoll, character))}){' '}
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
      </div>
    </BoxContainer>
  )
}
