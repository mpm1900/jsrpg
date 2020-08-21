import React, { useState } from 'react'
import Color from 'color'
import { useCharacterContext } from '../../contexts/CharacterContext'
import {
  getDamageTypeKeys,
  DamageTypeKeyColors,
  DamageTypeKeyT,
} from '../../types/Damage'
import { FlexContainer } from '../../elements/flex'
import { getRollText, RollCheckT } from '../../types/Roll'
import { TraitScore } from '../TraitScore'
import { CheckPreview } from '../CheckPreview'
import { unequipItem, CharacterSkillCheckKeyT } from '../../types/Character'
import { BoxContainer, BoxButton } from '../../elements/box'
import { IconDamageTypeMap, IconCharacterResourceMap } from '../../icons/maps'
import { Icon } from '../Icon'
import { ArmorIcon } from '../ArmorIcon'
import { ArmorT } from '../../types/Armor'
import { EquippableT, ItemRarityColorMap } from '../../types/Item'
import { ItemIcon } from '../ItemIcon'
import { CompareResultFn, ZERO_COMPARE, BASE_ARGS } from '../../util/compare'

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
  const { onChange, rawCharacter } = useCharacterContext()
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
      substyle={{ borderColor: borderColor }}
    >
      <FlexContainer style={{ marginBottom: collapsed ? 0 : 10 }}>
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
              onChange(unequipItem(rawCharacter)(item.id))
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
      {!collapsed && (
        <>
          {item.requirementCheck.roll !== 1 && showRequirementCheck && (
            <CheckPreview
              name='Requirement'
              check={item.requirementCheck}
              showCheckButton={false}
              compareResult={requirementCompare}
            />
          )}
          <FlexContainer $direction='column' style={{ marginTop: 10 }}>
            {item.traits.map((trait) => (
              <TraitScore
                key={trait.id}
                trait={trait}
                compareResult={traitCompare}
              />
            ))}
            {item.damageResistances && (
              <FlexContainer
                style={{
                  fontFamily: 'monospace',
                  flexWrap: 'wrap',
                  marginTop: 20,
                  justifyContent: 'space-evenly',
                }}
              >
                {getDamageTypeKeys(item.damageResistances)
                  .filter((k) => item.damageResistances[k])
                  .map((key) => (
                    <FlexContainer
                      // $full
                      key={key}
                      style={{
                        marginBottom: 8,
                      }}
                    >
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
                          item.damageResistances[key] as RollCheckT,
                        ) || 0}
                      </div>
                    </FlexContainer>
                  ))}
              </FlexContainer>
            )}
          </FlexContainer>
        </>
      )}
    </BoxContainer>
  )
}
