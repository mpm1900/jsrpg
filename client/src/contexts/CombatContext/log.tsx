import React from 'react'
import { AttackResultT, isUser, isEnemy } from './util'
import { ProcessedCharacterT, CharacterT } from '../../types/Character'
import { BASIC_ATTACK } from '../../objects/makeSkill'
import { getKeys } from '../../util/getKeys'

export const Span = (color: string, text: string, bold: boolean = true) => (
  <span style={{ color, fontWeight: bold ? 'bold' : 'normal' }}>{text}</span>
)
export const NameSpan = (character: CharacterT) =>
  isUser(character)
    ? Span('lightgreen', character.name)
    : Span('lightsalmon', character.name)

export const logResult = (
  attackResult: AttackResultT,
  source: ProcessedCharacterT,
  target: ProcessedCharacterT,
  addLine: (line: React.ReactNode) => void,
) => {
  if (attackResult.skill.id !== BASIC_ATTACK.id) {
    addLine(
      <span>
        {NameSpan(source)} casts {Span('#cda5f3', attackResult.skill.name)}
        {attackResult.skill.target && <span> on {NameSpan(target)}.</span>}
      </span>,
    )
  }
  if (attackResult.hitSuccess) {
    if (attackResult.skill.id === BASIC_ATTACK.id) {
      addLine(
        <span>
          {NameSpan(source)} attacks {NameSpan(target)} for{' '}
          {Span('white', `${attackResult.totalDamage} damage`)}.
        </span>,
      )
    } else {
      if (attackResult.rawDamage > 0) {
        addLine(
          <span>
            {Span('#cda5f3', attackResult.skill.name)} deals{' '}
            {Span('white', `${attackResult.totalDamage} damage`)}.
          </span>,
        )
      }
      if (attackResult.targetTraits.length > 0) {
        LogAddedTraits(attackResult, source, target, addLine)
      }
      if (attackResult.sourceTraits.length > 0) {
        console.log(source.name, attackResult.sourceTraits)
        LogAddedTraits(attackResult, source, target, addLine)
      }
    }
    if (attackResult.criticalSuccess) {
      addLine(<span style={{ color: 'khaki' }}>Critical hit!</span>)
    }
  } else {
    if (attackResult.skill.id === BASIC_ATTACK.id) {
      addLine(<span>{NameSpan(source)}'s attack missed.</span>)
    } else {
      addLine(
        <span>
          {Span('#cda5f3', attackResult.skill.name)}{' '}
          {attackResult.skill.target ? 'missed' : 'failed'}.
        </span>,
      )
    }
  }
  if (attackResult.dodgeSuccess) {
    addLine(
      <span>
        {NameSpan(target)} dodged {NameSpan(source)}'s attack
      </span>,
    )
  }
  if (target.stats.health <= target.healthOffset + attackResult.totalDamage) {
    addLine(Span('lightcoral', `${target.name} died`))
  }
}

export const cz = (v: number) => v !== 0
export const gv = (v: number) => (v > 0 ? 'gained' : 'lost')
export const LogAddedTraits = (
  attackResult: AttackResultT,
  source: ProcessedCharacterT,
  target: ProcessedCharacterT,
  addLine: (line: React.ReactNode) => void,
) => {
  attackResult.targetTraits.forEach((trait) => {
    const gfo = target.focusOffset - trait.focusOffset
    const focusOffset = gfo < 0 ? trait.focusOffset + gfo : trait.focusOffset
    if (cz(focusOffset)) {
      addLine(
        <span>
          {NameSpan(target)} {gv(focusOffset)} {focusOffset} FP.
        </span>,
      )
    }
    getKeys(trait.abilitiesModifiers).forEach((key) => {
      if (cz(trait.abilitiesModifiers[key])) {
        addLine(
          <span>
            {NameSpan(target)} {gv(trait.abilitiesModifiers[key])}{' '}
            {trait.abilitiesModifiers[key]} {key}.{' '}
            {trait.duration > 0 &&
              `(${trait.duration - 1} round${trait.duration !== 2 ? 's' : ''})`}
          </span>,
        )
      }
    })
    getKeys(trait.statsModifiers).forEach((key) => {
      if (cz(trait.statsModifiers[key])) {
        addLine(
          <span>
            {NameSpan(target)} {gv(trait.statsModifiers[key])}{' '}
            {trait.statsModifiers[key]} {key}.
          </span>,
        )
      }
    })
  })
  attackResult.sourceTraits.forEach((trait) => {
    const gfo = source.focusOffset - trait.focusOffset
    const focusOffset = gfo < 0 ? trait.focusOffset + gfo : trait.focusOffset
    if (cz(focusOffset)) {
      addLine(
        <span>
          {NameSpan(source)} {gv(focusOffset)} {focusOffset} FP.
        </span>,
      )
    }
    const gho = source.healthOffset - trait.healthOffset
    const healthOffset = gho < 0 ? trait.healthOffset + gho : trait.healthOffset
    if (cz(healthOffset)) {
      addLine(
        <span>
          {NameSpan(source)} {gv(healthOffset)} {healthOffset} HP.
        </span>,
      )
    }
    getKeys(trait.abilitiesModifiers).forEach((key) => {
      if (cz(trait.abilitiesModifiers[key])) {
        addLine(
          <span>
            {NameSpan(source)} {gv(trait.abilitiesModifiers[key])}{' '}
            {trait.abilitiesModifiers[key]} {key}.{' '}
            {trait.duration > 0 &&
              `(${trait.duration - 1} round${trait.duration !== 2 ? 's' : ''})`}
          </span>,
        )
      }
    })
    getKeys(trait.statsModifiers).forEach((key) => {
      if (cz(trait.statsModifiers[key])) {
        addLine(
          <span>
            {NameSpan(source)} {gv(trait.statsModifiers[key])}{' '}
            {trait.statsModifiers[key]} {key}.
          </span>,
        )
      }
    })
  })
}
