import React, { useState, useMemo } from 'react'
import { usePartyContext } from '../../contexts/PartyContext'
import { ProcessedCharacterT } from '../../types/Character'
import { BoxContainer } from '../../elements/box'

import CharactersIcon from '../../icons/svg/lorc/two-shadows.svg'
import { Icon } from '../Icon'
import { FlexContainer } from '../../elements/flex'
import { Link } from 'react-router-dom'

interface AppSideOptionT {
  key: string
  icon: string
  Component: React.FC
}
const options: [AppSideOptionT] = [
  {
    key: 'characters',
    icon: CharactersIcon,
    Component: () => <AppSidebarCharacters />,
  },
]

export const AppSidebar = () => {
  const [activeKey, _setActiveKey] = useState<string | null>('characters')
  const setActiveKey = (key: string) =>
    _setActiveKey(key === activeKey ? null : key)
  const activeOption = useMemo(() => options.find((o) => o.key === activeKey), [
    activeKey,
  ])
  return (
    <BoxContainer
      substyle={{
        display: 'flex',
        padding: 0,
      }}
    >
      <FlexContainer
        $direction='column'
        style={{
          width: 60,
        }}
      >
        {options.map((option, i) => (
          <div
            key={option.key}
            style={{
              height: 60,
              width: 60,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backgroundColor:
                activeKey === option.key ? '#111' : 'transparent',
              borderTop: i === 0 ? 'none' : '1px solid #555',
              borderBottom: '1px solid black',
              borderRight: activeKey === option.key ? 'none' : '1px solid #555',
            }}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setActiveKey(option.key)
            }}
          >
            <Icon src={option.icon} size={24} />
          </div>
        ))}
        <FlexContainer
          $full
          style={{
            borderTop: '1px solid #555',
            borderRight: activeKey !== null ? '1px solid #555' : 'none',
          }}
        />
      </FlexContainer>
      {activeOption && (
        <div
          style={{
            padding: 8,
            backgroundColor: '#111',
          }}
        >
          <activeOption.Component />
        </div>
      )}
    </BoxContainer>
  )
}

const AppSidebarCharacters = () => {
  const { userParty } = usePartyContext()
  return (
    <FlexContainer $direction='column'>
      {userParty.characters.map((character: ProcessedCharacterT) => (
        <Link
          key={character.id}
          to={`/characters/${character.id}`}
          style={{
            padding: 8,
          }}
        >
          {character.name}
        </Link>
      ))}
    </FlexContainer>
  )
}
