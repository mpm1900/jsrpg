import React, { CSSProperties } from 'react'
import { BoxContainer } from '../../elements/box'
import { Link, useLocation } from 'react-router-dom'
import { useCharacterContext } from '../../contexts/CharacterContext'
import { usePartyContext } from '../../contexts/PartyContext'
import { sortById } from '../../util/sortById'
import { Monospace } from '../../elements/monospace'

const activeStyles: CSSProperties = {
  background: '#111',
  boxShadow: 'inset 0 0 3px black',
}
const inactiveStyles: CSSProperties = {
  background: '#555',
}

export const CharacterHeader = () => {
  const { character } = useCharacterContext()
  const { userParty } = usePartyContext()
  const check = (id: string): CSSProperties =>
    character.id === id ? activeStyles : inactiveStyles
  return (
    <BoxContainer
      style={{ borderLeft: 'none', borderRight: 'none' }}
      substyle={{
        height: 61,
        display: 'flex',
        alignItems: 'center',
        padding: '0px 8px',
        borderColor: 'rgba(255,255,255,0.4)',
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        background: 'rgba(255,255,255,0.4)',
      }}
    >
      {sortById(userParty.characters).map((c) => (
        <BoxContainer
          tag={Link}
          to={`/characters/${c.id}`}
          style={{ marginRight: 4 }}
          substyle={{
            padding: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textShadow: '1px 1px 2px black',
            ...check(c.id),
          }}
        >
          <Monospace>{c.name}</Monospace>
        </BoxContainer>
      ))}
    </BoxContainer>
  )
}
