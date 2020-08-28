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
  if (attackResult.skillId !== BASIC_ATTACK.id) {
    addLine(
      <span>
        {NameSpan(source)} casts {Span('#cda5f3', attackResult.skillName)} on{' '}
        {NameSpan(target)}.
      </span>,
    )
  }
  if (attackResult.hitSuccess) {
    if (attackResult.skillId === BASIC_ATTACK.id) {
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
            {Span('#cda5f3', attackResult.skillName)} deals{' '}
            {Span('white', `${attackResult.totalDamage} damage`)}.
          </span>,
        )
      }
      if (attackResult.traits.length > 0) {
        LogAddedTraits(attackResult, source, target, addLine)
      }
    }
    if (attackResult.criticalSuccess) {
      addLine(<span style={{ color: 'khaki' }}>Critical hit!</span>)
    }
  } else {
    if (attackResult.skillId === BASIC_ATTACK.id) {
      addLine(<span>{NameSpan(source)}'s attack missed.</span>)
    } else {
      addLine(<span>{Span('#cda5f3', attackResult.skillName)} missed.</span>)
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

const cz = (v: number) => v !== 0
const gv = (v: number) => (v > 0 ? 'gained' : 'lost')
export const LogAddedTraits = (
  attackResult: AttackResultT,
  source: ProcessedCharacterT,
  target: ProcessedCharacterT,
  addLine: (line: React.ReactNode) => void,
) => {
  attackResult.traits.forEach((trait) => {
    getKeys(trait.abilitiesModifiers).forEach((key) => {
      if (cz(trait.abilitiesModifiers[key])) {
        addLine(
          <span>
            {NameSpan(target)} {gv(trait.abilitiesModifiers[key])}{' '}
            {trait.abilitiesModifiers[key]} {key}.
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
}
