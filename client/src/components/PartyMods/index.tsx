import React from 'react'
import { FlexContainer } from '../../elements/flex'
import { usePartyContext } from '../../contexts/PartyContext'
import { ModPreview } from '../ModPreview'
import { useCharacterContext } from '../../contexts/CharacterContext'

export const PartyMods = () => {
  const { rawCharacter } = useCharacterContext()
  const { userParty, equipMod } = usePartyContext()
  return (
    <FlexContainer $direction='column'>
      {userParty.mods.map((mod) => (
        <ModPreview
          key={mod.id}
          mod={mod}
          onEquip={(modId) => {
            equipMod(rawCharacter.id, modId)
          }}
        />
      ))}
    </FlexContainer>
  )
}
