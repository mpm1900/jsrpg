import React from 'react'
import { SkillT } from '../../types/Skill'
import { useCharacterContext } from '../../contexts/CharacterContext'
import { makeSkill } from '../../objects/makeSkill'
import { BoxContainer } from '../../elements/box'
import { FlexContainer, FullContainer } from '../../elements/flex'
import { CheckPreview } from '../CheckPreview'
import { getKeys } from '../../util/getKeys'
import { EventsTypeMap } from '../../types/Events'
import { TraitScore } from '../TraitScore'
import { combineTraits, CharacterTraitT } from '../../types/Character'
import { DamageRollScores, DamageRollScore } from '../DamageRollScores'
import {
  getRollRange,
  reduceCharacterRoll,
  getRollText,
} from '../../types/Roll2'

export interface SkillPreviewPropsT {
  skillId: string
  skill?: SkillT
  showRequirementCheck?: boolean
}
export const SkillPreview = (props: SkillPreviewPropsT) => {
  const { skillId, showRequirementCheck } = props
  const { character } = useCharacterContext()
  const skill =
    props.skill || character.skills.find((s) => s.id === skillId) || makeSkill()
  return (
    <BoxContainer
      style={{
        width: 380,
        background: `url(${skill.imgSrc}) no-repeat center center`,
        backgroundSize: 'cover',
      }}
      substyle={{
        background: 'rgba(0,0,0,0.8)',
        borderColor: 'rgba(255,255,255,0.4)',
      }}
    >
      <FlexContainer style={{ marginBottom: 10 }}>
        <h3 style={{ margin: '0 10px 0 0', flex: 1 }}>{skill.name}</h3>
      </FlexContainer>

      <FlexContainer style={{ marginBottom: 10 }}>
        <strong style={{ marginRight: 10 }}>Cost</strong>
        <span>{skill.focusCost}</span>
      </FlexContainer>
      <FlexContainer style={{ marginBottom: 10 }}>
        {showRequirementCheck && (
          <FullContainer>
            <CheckPreview
              name='Requirement'
              showCheckButton={false}
              check={skill.requirementCheck}
            />
          </FullContainer>
        )}
        {skill.check && (
          <FullContainer>
            <CheckPreview
              name='Skill Check'
              showCheckButton={false}
              check={skill.check}
            />
          </FullContainer>
        )}
        {skill.combineWeaponDamage && (
          <FullContainer>
            <CheckPreview
              name='Accuracy'
              showCheckButton={false}
              check={character.weapon.accuracyCheck}
            />
          </FullContainer>
        )}
      </FlexContainer>
      {skill.targetTraits.length > 0 && (
        <FlexContainer style={{ marginBottom: 10 }}>
          <strong
            style={{
              fontFamily: 'monospace',
              marginRight: 10,
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            target:
          </strong>
          <TraitScore trait={combineTraits(skill.targetTraits)} />
        </FlexContainer>
      )}
      {skill.sourceTraits.length > 0 && (
        <FlexContainer style={{ marginBottom: 10 }}>
          <strong
            style={{
              fontFamily: 'monospace',
              marginRight: 10,
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            self:
          </strong>
          <TraitScore trait={combineTraits(skill.sourceTraits)} />
        </FlexContainer>
      )}
      <div style={{ marginBottom: 10 }}>
        {getKeys(skill.events).map((key) => (
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
              trait={combineTraits(skill.events[key] as CharacterTraitT[])}
            />
          </FlexContainer>
        ))}
      </div>
      {skill.combineWeaponDamage && (
        <div style={{ marginBottom: 10 }}>
          {getKeys(character.weapon.events).map((key) => (
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
                  character.weapon.events[key] as CharacterTraitT[],
                )}
              />
            </FlexContainer>
          ))}
        </div>
      )}
      {(skill.combineWeaponDamage ||
        Object.keys(skill.damageRolls).length > 0) && (
        <DamageRollScores
          parent={skill.combineWeaponDamage ? character.weapon : skill}
        >
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
                />
              ))}
            </>
          )}
        </DamageRollScores>
      )}
    </BoxContainer>
  )
}
