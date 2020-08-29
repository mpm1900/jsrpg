import React from 'react'
import { RollLog } from '../RollLog'
import Dice6 from '../../icons/svg/delapouite/dice-six-faces-six.svg'
import Attack from '../../icons/svg/cathelineau/swordman.svg'
import Items from '../../icons/svg/lorc/swap-bag.svg'
import Skills from '../../icons/svg/delapouite/skills.svg'
import { CharacterItems } from '../CharacterItems'
import { AttackLog } from '../AttackLog'
import { useUIContext } from '../../contexts/UIContext'
import { SidebarOptionT, Sidebar } from '../Sidebar'
import { PartySkills } from '../PartySkills'

export const options: SidebarOptionT[] = [
  {
    key: 'roll-log',
    icon: Dice6,
    Component: RollLog,
  },
  {
    key: 'attack-log',
    icon: Attack,
    Component: AttackLog,
  },
  {
    key: 'items',
    icon: Items,
    Component: CharacterItems,
  },
  {
    key: 'skills',
    icon: Skills,
    Component: PartySkills,
  },
]

export interface AppLogPropsT {}
export const AppLog = (props: AppLogPropsT) => {
  const { logKey, setLogKey } = useUIContext()
  return (
    <Sidebar
      activeKey={logKey}
      setActiveKey={setLogKey}
      options={options}
      direction='left'
    />
  )
}
