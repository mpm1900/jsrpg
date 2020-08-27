import React, { useState } from 'react'
import { useRollContext } from '../../contexts/RollContext'
import { RollResult } from '../RollResult'
import { FlexContainer } from '../../elements/flex'
import { Icon } from '../Icon'
import Dice6 from '../../icons/svg/delapouite/dice-six-faces-six.svg'

export interface RollLogPropsT {}
export const RollLog = (props: RollLogPropsT) => {
  const { history, execStaticRoll } = useRollContext()
  const [text, setText] = useState('')
  const [submitLog, setSubmitLog] = useState<string[]>([])
  const [index, setIndex] = useState(0)
  const submit = () => {
    try {
      execStaticRoll({ roll: text, keys: [], value: 0 }, true, true)
      setSubmitLog([...submitLog, text])
      setIndex(submitLog.length)
    } catch (e) {
      alert(e)
    } finally {
      setText('')
    }
  }
  return (
    <FlexContainer $direction='column' $full style={{ width: 400 }}>
      {history.length > 0 ? (
        <FlexContainer
          $full
          $direction='column'
          style={{ overflow: 'auto', padding: 10 }}
        >
          {history.map((roll) => (
            <RollResult key={roll._id} roll={roll} />
          ))}
        </FlexContainer>
      ) : (
        <FlexContainer $full />
      )}
      <FlexContainer>
        <input
          value={text}
          style={{ flex: 1 }}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.keyCode === 13) {
              submit()
            }
            if (e.keyCode === 38) {
              setText(submitLog[index] || '')
              setIndex(index - 1)
            }
          }}
        />
        <button onClick={submit}>
          <Icon src={Dice6} size={18} fill='#4bebc6' />
        </button>
      </FlexContainer>
    </FlexContainer>
  )
}
