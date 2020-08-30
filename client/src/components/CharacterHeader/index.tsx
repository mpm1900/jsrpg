import React, { CSSProperties } from 'react'
import { BoxContainer } from '../../elements/box'
import { Link, useLocation } from 'react-router-dom'
import { useCharacterContext } from '../../contexts/CharacterContext'
import { usePartyContext } from '../../contexts/PartyContext'
import { sortById } from '../../util/sortById'

const activeStyles: CSSProperties = {
  background: '#111',
  boxShadow: 'inset 0 0 3px black',
}
const inactiveStyles: CSSProperties = {
  backgroundColor: '#333',
}

export const CharacterHeader = () => {
  const { character } = useCharacterContext()
  const { userParty } = usePartyContext()
  const check = (id: string): CSSProperties =>
    character.id === id ? activeStyles : inactiveStyles
  return (
    <BoxContainer
      substyle={{
        height: 51,
        padding: 0,
        alignItems: 'center',
        display: 'flex',
      }}
    >
      {sortById(userParty.characters).map((c) => (
        <BoxContainer
          tag={Link}
          to={`/characters/${c.id}`}
          style={{
            height: '100%',
          }}
          substyle={{
            padding: '0 20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            ...check(c.id),
          }}
        >
          {c.name}
        </BoxContainer>
      ))}
    </BoxContainer>
  )
}
