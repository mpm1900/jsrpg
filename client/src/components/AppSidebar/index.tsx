import React from 'react'
import { usePartyContext } from '../../contexts/PartyContext'
import { ProcessedCharacterT } from '../../types/Character'
import { BoxButton } from '../../elements/box'

import CharactersIcon from '../../icons/svg/lorc/two-shadows.svg'
import { FlexContainer } from '../../elements/flex'
import { Link, useHistory } from 'react-router-dom'
import { makeCharacter } from '../../objects/makeCharacter'
import { Sidebar, SidebarOptionT } from '../Sidebar'
import { useUIContext } from '../../contexts/UIContext'

export const MAIN_OPTIONS: SidebarOptionT[] = [
  {
    key: 'characters',
    icon: CharactersIcon,
    Component: () => <AppSidebarCharacters />,
  },
]

export interface AppSidebarPropsT {}
export const AppSidebar = (props: AppSidebarPropsT) => {
  const { sidebarKey, setSidebarKey } = useUIContext()
  return (
    <Sidebar
      options={MAIN_OPTIONS}
      direction='right'
      activeKey={sidebarKey}
      setActiveKey={setSidebarKey}
    />
  )
}

const AppSidebarCharacters = () => {
  const { userParty, upsertCharacter } = usePartyContext()
  const history = useHistory()
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
      {userParty.characters.length < 3 && (
        <BoxButton
          onClick={() => {
            const newCharacter = makeCharacter('new character')
            upsertCharacter(newCharacter)
            history.push(`/characters/${newCharacter.id}`)
          }}
        >
          Add New Character
        </BoxButton>
      )}
    </FlexContainer>
  )
}
