import React from 'react'
import { useCharacterContext } from '../../contexts/CharacterContext'
import {
  CharacterAbilityKeyT,
  CharacterKeyMap3,
  characterAbilityScoreCosts,
  setCharacterAbilityScore,
} from '../../types/Character'
import { useRollContext } from '../../contexts/RollContext'
import { BoxContainer } from '../../elements/box'
import { FlexContainer } from '../../elements/flex'

export interface AbilityScorePropsT {
  id: CharacterAbilityKeyT
  edit?: boolean
}
export const AbilityScore = (props: AbilityScorePropsT) => {
  const { id, edit = true } = props
  const { character, rawCharacter, onChange } = useCharacterContext()
  const { execCheck } = useRollContext()
  const keyName = CharacterKeyMap3[id]
  const rawValue = rawCharacter.abilities[id]
  const displayValue = character.abilities[id]
  const cost = characterAbilityScoreCosts[id]
  const points = character.resources.characterPoints

  return (
    <PureAbilityScore
      name={keyName}
      value={displayValue}
      rawValue={rawValue}
      points={points}
      cost={cost}
      edit={edit}
      onClick={() => {
        execCheck({
          keys: [id],
        })
      }}
      onIncrement={() => {
        onChange(
          setCharacterAbilityScore(rawCharacter)(
            id,
            rawValue + 1,
            points - cost,
          ),
        )
      }}
      onDecrement={() => {
        onChange(
          setCharacterAbilityScore(rawCharacter)(
            id,
            rawValue - 1,
            points + cost,
          ),
        )
      }}
    />
  )
}

export const PureAbilityScore = (props: any) => {
  const {
    name,
    edit,
    rawValue,
    value,
    points,
    cost,
    onClick,
    onIncrement,
    onDecrement,
  } = props
  return (
    <BoxContainer
      substyle={{
        padding: 0,
        display: 'flex',
        fontFamily: 'monospace',
      }}
    >
      <FlexContainer
        style={{ padding: 8, marginRight: 10, whiteSpace: 'nowrap' }}
        $direction='column'
        $full
      >
        <a href='#' onClick={onClick}>
          {name} ({rawValue})
        </a>
        <span style={{ fontSize: 36, fontWeight: 'bolder' }}>{value}</span>
      </FlexContainer>
      {edit && (
        <FlexContainer
          $direction='column'
          style={{
            width: 30,
          }}
        >
          <button
            style={{ margin: 0 }}
            disabled={points < cost || rawValue === 18}
            onClick={onIncrement}
          >
            +
          </button>
          <FlexContainer
            $full
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div>{cost}</div>
          </FlexContainer>
          <button
            style={{ margin: 0 }}
            disabled={rawValue === 3}
            onClick={onDecrement}
          >
            -
          </button>
        </FlexContainer>
      )}
    </BoxContainer>
  )
}
