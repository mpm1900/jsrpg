import React, { useMemo, useState } from 'react'
import { FlexContainer } from '../../elements/flex'
import { BoxButton } from '../../elements/box'
import { useModalContext } from '../../contexts/ModalContext'
import makeItem from '../../objects/builders/makeItem'
import { ItemPreviewSmall } from '../ItemPreviewSmall'
import { Monospace } from '../../elements/monospace'

export interface CombatVictoryModalPropsT {
  reset: (done: boolean) => void
}
export const CombatVictoryModal = (props: CombatVictoryModalPropsT) => {
  const { reset } = props
  const { close } = useModalContext()

  const [chosenItemId, setChosenItemId] = useState<string | undefined>()
  const rewardChoices = useMemo(() => {
    return [makeItem(), makeItem(), makeItem(), makeItem(), makeItem()]
  }, [])

  const onNextClick = () => {
    reset(false)
    close(rewardChoices.find((i) => i.id === chosenItemId))
  }

  console.log(rewardChoices)
  return (
    <FlexContainer $direction='column'>
      <h1 style={{ textAlign: 'center', marginTop: 0 }}>Victory!</h1>
      <FlexContainer $direction='column' style={{ alignItems: 'center' }}>
        <Monospace style={{ marginBottom: 20 }}>
          Each character gained 5 XP
        </Monospace>
        <span>Choose a Reward</span>
        <FlexContainer>
          {rewardChoices.map((item) => (
            <div
              style={{
                border: '2px solid transparent',
                borderColor: chosenItemId === item.id ? 'white' : 'transparent',
              }}
            >
              <ItemPreviewSmall
                item={item}
                size={60}
                onClick={() => setChosenItemId(item.id)}
              />
            </div>
          ))}
        </FlexContainer>
      </FlexContainer>
      <FlexContainer style={{ marginTop: 20, alignItems: 'center' }}>
        <BoxButton disabled={chosenItemId === undefined} onClick={onNextClick}>
          Next Battle
        </BoxButton>
      </FlexContainer>
    </FlexContainer>
  )
}
