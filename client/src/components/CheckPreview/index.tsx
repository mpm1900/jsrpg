import React, { useMemo } from 'react'
import { useRollContext } from '../../contexts/RollContext'
import { CharacterKeyMap3 } from '../../types/Character'
import { getSign } from '../../util/getSign'
import { getValueString } from '../../util/getValueString'
import { FlexContainer } from '../../elements/flex'
import { Icon } from '../Icon'
import Dice6 from '../../icons/svg/delapouite/dice-six-faces-six.svg'
import { CompareResultFn, ZERO_COMPARE, BASE_ARGS } from '../../util/compare'
import { CharacterCheckT } from '../../types/Roll2'

export interface CheckPreviewPropsT {
  check: CharacterCheckT
  name?: string
  showCheckButton?: boolean
  compareResult?: CompareResultFn
}
export const CheckPreview = (props: CheckPreviewPropsT) => {
  const {
    check,
    name,
    showCheckButton = true,
    compareResult = ZERO_COMPARE,
  } = props
  const { execCheck, getProbability } = useRollContext()
  const value = check.value || 0
  const rollKeys = (check.keys || []).map((k) => CharacterKeyMap3[k])
  const keyStr =
    rollKeys.reduce((str, key, i) => `${str}${i !== 0 ? '+' : ''}${key}`, '') +
    (rollKeys.length === 0 ? '' : getSign(value))
  const rollStr = check.roll.string ? ` {${check.roll.string}} ` : ''
  const probability = useMemo(() => getProbability(check, true), [
    check,
    getProbability,
  ])

  return (
    <FlexContainer>
      <div
        style={{
          marginRight: 10,
          flex: 1,
          color: compareResult(...BASE_ARGS),
        }}
      >
        {name && <strong>{name}</strong>}
        <div style={{ fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
          {rollStr}
          {keyStr}
          {rollStr && getValueString(value)}{' '}
          {!rollStr && ' = ' + getValueString(check.roll.modifier)} (
          {probability}%)
        </div>
      </div>
      {showCheckButton && (
        <div>
          <button onClick={() => execCheck(check)}>
            <Icon src={Dice6} size={18} fill='4bebc6' />
          </button>
        </div>
      )}
    </FlexContainer>
  )
}
