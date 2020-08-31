import React, { useState } from 'react'
import Color from 'color'
import { useCharacterContext } from '../../contexts/CharacterContext'
import {
  getDamageTypeKeys,
  DamageTypeKeyColors,
  DamageTypeKeyT,
} from '../../types/Damage'
import { FlexContainer } from '../../elements/flex'
import { TraitScore } from '../TraitScore'
import { CheckPreview } from '../CheckPreview'
import { CharacterSkillCheckKeyT } from '../../types/Character'
import { BoxContainer, BoxButton } from '../../elements/box'
import { IconDamageTypeMap, IconCharacterResourceMap } from '../../icons/maps'
import { Icon } from '../Icon'
import { ArmorIcon } from '../ArmorIcon'
import { ArmorT } from '../../types/Armor'
import { EquippableT, ItemRarityColorMap } from '../../types/Item'
import { ItemIcon } from '../ItemIcon'
import { CompareResultFn, ZERO_COMPARE, BASE_ARGS } from '../../util/compare'
import { usePartyContext } from '../../contexts/PartyContext'
import { CharacterRollT, getRollText } from '../../types/Roll2'

export interface ItemPreviewPropsT {
  item: EquippableT
  showEquipButton?: boolean
  showRequirementCheck?: boolean
  showCollapseButton?: boolean
  requirementCompare?: CompareResultFn
  traitCompare?: (key: CharacterSkillCheckKeyT) => CompareResultFn
  resistancesCompare?: (key: DamageTypeKeyT) => CompareResultFn
  costComare?: CompareResultFn
}
export const ItemPreview = (props: ItemPreviewPropsT) => {
  const {
    item,
    showEquipButton = true,
    showRequirementCheck = true,
    showCollapseButton = false,
  } = props
  const { rawCharacter } = useCharacterContext()
  const { unequipItem } = usePartyContext()
  const [collapsed, setCollapsed] = useState(false)
  const requirementCompare = props.requirementCompare || ZERO_COMPARE
  const traitCompare = props.traitCompare || ((key) => ZERO_COMPARE)
  const resistancesCompare = props.resistancesCompare || ((key) => ZERO_COMPARE)
  const costComare = props.costComare || ZERO_COMPARE
  const isArmor = item.type === 'armor'
  const rarityColor = ItemRarityColorMap[item.rarity]
  const borderColor = Color(rarityColor)
    .desaturate(0.5)
    .fade(0.5)
    .rgb()
    .string()
  return (
    <BoxContainer
      style={{ width: 380 }}
      substyle={{ borderColor: borderColor, padding: 0 }}
    >
      <FlexContainer
        style={{
          padding: 8,
          background:
            'linear-gradient(0deg, rgba(34,34,34,1) 0%, rgba(51,51,51,1) 100%)',
          borderBottom: '1px solid #555',
        }}
      >
        {isArmor ? (
          <ArmorIcon
            item={item as ArmorT}
            size={24}
            fill={rarityColor}
            style={{ marginRight: 10 }}
          />
        ) : (
          <ItemIcon
            item={item}
            size={24}
            style={{ marginRight: 10 }}
            fill={rarityColor}
          />
        )}
        <h3
          style={{
            margin: '0 10px 0 0',
            flex: 1,
            whiteSpace: 'nowrap',
            // color: rarityColor,
          }}
        >
          {item.name}
        </h3>
        {showCollapseButton && (
          <BoxButton
            substyle={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => {
              setCollapsed((c) => !c)
            }}
          >
            {collapsed ? 'more' : 'less'}
          </BoxButton>
        )}
        {!showEquipButton && (
          <FlexContainer
            style={{
              margin: '0 0 10px 0',
              fontWeight: 'bold',
              fontSize: 12,
              color: costComare(...BASE_ARGS),
            }}
          >
            <Icon
              src={IconCharacterResourceMap[item.resource]}
              size={12}
              fill={costComare('lightcoral', 'white', 'lightgreen')}
              style={{ margin: '0 8px' }}
            />
            {item.cost}
          </FlexContainer>
        )}
        {showEquipButton && (
          <BoxButton
            substyle={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => {
              unequipItem(rawCharacter.id, item.id)
            }}
          >
            <Icon
              src={IconCharacterResourceMap[item.resource]}
              size={12}
              fill='rgba(255,255,255,0.8)'
              style={{ marginRight: 10 }}
            />
            {item.cost}
          </BoxButton>
        )}
      </FlexContainer>
      <div
        style={{
          padding: '8px 16px',
          background: '#222',
          boxShadow: 'inset 0px 0px 15px black',
        }}
      >
        {!collapsed && (
          <>
            {item.requirementCheck.roll.modifier !== 1 && showRequirementCheck && (
              <div style={{ marginTop: 4 }}>
                <CheckPreview
                  name='Requirement'
                  check={item.requirementCheck}
                  showCheckButton={false}
                  compareResult={requirementCompare}
                />
              </div>
            )}
            <FlexContainer $direction='column'>
              {item.traits.map((trait) => (
                <div key={trait.id} style={{ marginTop: 10, marginBottom: 10 }}>
                  <TraitScore trait={trait} compareResult={traitCompare} />
                </div>
              ))}
              {item.damageResistances && (
                <FlexContainer
                  style={{
                    fontFamily: 'monospace',
                    flexWrap: 'wrap',
                    justifyContent: 'space-evenly',
                    marginBottom: 8,
                  }}
                >
                  {getDamageTypeKeys(item.damageResistances)
                    .filter((k) => item.damageResistances[k])
                    .map((key) => (
                      <FlexContainer key={key}>
                        <Icon
                          src={IconDamageTypeMap[key]}
                          size={14}
                          fill={DamageTypeKeyColors[key]}
                          style={{
                            marginRight: 8,
                          }}
                        />
                        <div
                          style={{
                            fontSize: 16,
                            lineHeight: '16px',
                            color: resistancesCompare(key)(...BASE_ARGS),
                          }}
                        >
                          {getRollText(
                            item.damageResistances[key] as CharacterRollT,
                          ) || 0}
                        </div>
                      </FlexContainer>
                    ))}
                </FlexContainer>
              )}
            </FlexContainer>
          </>
        )}
      </div>
    </BoxContainer>
  )
}
