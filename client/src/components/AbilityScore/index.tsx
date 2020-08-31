import React from 'react'
import { useCharacterContext } from '../../contexts/CharacterContext'
import {
  CharacterAbilityKeyT,
  CharacterKeyMap3,
  characterAbilityScoreCosts,
  setCharacterAbilityScore,
} from '../../types/Character'
import { useRollContext } from '../../contexts/RollContext'
import { BoxContainer, BoxButton } from '../../elements/box'
import { FlexContainer } from '../../elements/flex'
import { makeCharacterCheck } from '../../types/Roll2'
import { usePartyContext } from '../../contexts/PartyContext'

export interface AbilityScorePropsT {
  id: CharacterAbilityKeyT
  edit?: boolean
}
export const AbilityScore = (props: AbilityScorePropsT) => {
  const { id, edit = true } = props
  const { character, rawCharacter, onChange } = useCharacterContext()
  const { upsertItem } = usePartyContext()
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
        execCheck(makeCharacterCheck([id]))
      }}
      onIncrement={() => {
        const [char, items] = setCharacterAbilityScore(rawCharacter)(
          id,
          rawValue + 1,
          points - cost,
        )
        onChange(char)
        items.forEach((item) => {
          upsertItem(item)
        })
      }}
      onDecrement={() => {
        const [char, items] = setCharacterAbilityScore(rawCharacter)(
          id,
          rawValue - 1,
          points + cost,
        )
        onChange(char)
        items.forEach((item) => {
          upsertItem(item)
        })
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
        <span
          style={{
            fontWeight: 'bold',
            color: 'rgba(255,255,255,0.5)',
            textShadow: '1px 1px 0px black',
          }}
        >
          {name} ({rawValue})
        </span>
        <span
          style={{
            fontSize: 36,
            fontWeight: 'bolder',
            textShadow: '1px 1px 3px black',
            color:
              value > rawValue
                ? 'lightgreen'
                : value < rawValue
                ? 'lightcoral'
                : 'white',
          }}
        >
          {value}
        </span>
      </FlexContainer>
      {edit && (
        <FlexContainer
          $direction='column'
          style={{
            width: 30,
          }}
        >
          <BoxButton
            style={{ margin: 0 }}
            disabled={points < cost || rawValue === 18}
            onClick={onIncrement}
          >
            +
          </BoxButton>
          <FlexContainer
            $full
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div>{cost}</div>
          </FlexContainer>
          <BoxButton
            style={{ margin: 0 }}
            disabled={rawValue === 3}
            onClick={onDecrement}
          >
            -
          </BoxButton>
        </FlexContainer>
      )}
    </BoxContainer>
  )
}