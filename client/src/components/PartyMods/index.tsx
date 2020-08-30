import React from 'react'
import { FlexContainer } from '../../elements/flex'
import { usePartyContext } from '../../contexts/PartyContext'
import { ModPreview } from '../ModPreview'

export const PartyMods = () => {
  const { userParty } = usePartyContext()
  return (
    <FlexContainer $direction='column'>
      {userParty.mods.map((mod) => (
        <ModPreview key={mod.id} mod={mod} />
      ))}
    </FlexContainer>
  )
}
