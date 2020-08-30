import React from 'react'
import { FlexContainer } from '../../elements/flex'
import { BoxButton } from '../../elements/box'
import { useModalContext } from '../../contexts/ModalContext'
import { useHistory } from 'react-router'

export interface CombatLossModalPropsT {
  wins: number
}
export const CombatLossModal = (props: CombatLossModalPropsT) => {
  const { wins } = props
  const history = useHistory()
  const { close } = useModalContext()

  const onNextClick = () => {
    close()
    history.push('/characters/')
  }
  return (
    <FlexContainer $direction='column'>
      <h1 style={{ textAlign: 'center', marginTop: 0 }}>You Died...</h1>
      <span>But you won {wins} times.</span>
      <FlexContainer>
        <BoxButton onClick={onNextClick}>Back to Characters</BoxButton>
      </FlexContainer>
    </FlexContainer>
  )
}
