import React, { CSSProperties } from 'react'
import { BoxContainer } from '../../elements/box'
import { Link, useLocation } from 'react-router-dom'

const activeStyles: CSSProperties = {
  background: '#111',
  boxShadow: 'inset 0 0 3px black',
}
const inactiveStyles: CSSProperties = {
  backgroundColor: '#333',
}

export const AppHeader = () => {
  const location = useLocation()
  const { pathname } = location
  const chunks = pathname.split('/')
  const check = (paths: string[]): CSSProperties =>
    paths.includes(chunks[1]) ? activeStyles : inactiveStyles
  return (
    <BoxContainer
      substyle={{
        height: 64,
        padding: 0,
        alignItems: 'center',
        display: 'flex',
      }}
    >
      <div
        style={{
          fontFamily: 'monospace',
          fontSize: 24,
          margin: '0 30px',
        }}
      >
        rpgjs
      </div>
      <BoxContainer
        tag={Link}
        to=''
        style={{
          height: '100%',
        }}
        substyle={{
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          ...check(['', 'characters']),
        }}
      >
        edit characters
      </BoxContainer>
      <BoxContainer
        tag={Link}
        to='/battle'
        style={{
          height: '100%',
        }}
        substyle={{
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          ...check(['battle']),
        }}
      >
        enter combat
      </BoxContainer>
    </BoxContainer>
  )
}
