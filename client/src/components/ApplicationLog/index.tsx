import React, { useState } from 'react'
import { FlexContainer } from '../../elements/flex'
import { RollLog } from '../RollLog'
import { BoxContainer } from '../../elements/box'
import Dice6 from '../../icons/svg/delapouite/dice-six-faces-six.svg'
import Attack from '../../icons/svg/cathelineau/swordman.svg'
import Items from '../../icons/svg/lorc/swap-bag.svg'
import { Icon } from '../Icon'
import { CharacterItems } from '../CharacterItems'
import { AttackLog } from '../AttackLog'

export const options: any[] = [
  {
    key: 'roll-log',
    icon: Dice6,
    render: () => <RollLog />,
  },
  {
    key: 'attack-log',
    icon: Attack,
    render: () => <AttackLog />,
  },
  {
    key: 'items',
    icon: Items,
    render: () => <CharacterItems />,
  },
]

export interface ApplicationLogPropsT {}
export const ApplicationLog = (props: ApplicationLogPropsT) => {
  const [activeKey, _setActiveKey] = useState<string | null>(null)
  const setActiveKey = (key: string) => {
    if (key === activeKey) {
      _setActiveKey(null)
    } else {
      _setActiveKey(key)
    }
  }
  return (
    <BoxContainer
      style={{
        height: 'calc(100% - 2px)',
      }}
      substyle={{ overflow: 'auto', display: 'flex', padding: 0 }}
    >
      {activeKey && (
        <FlexContainer
          $full
          style={{
            minWidth: 400,
            borderRight: '1px solid black',
            background: '#111',
          }}
        >
          {options.find((o) => o.key === activeKey).render()}
        </FlexContainer>
      )}
      <ApplicationLogSideBar
        activeKey={activeKey || ''}
        setActiveKey={setActiveKey}
      />
    </BoxContainer>
  )
}

const baseStyles: React.CSSProperties = {
  borderLeft: '1px solid #555',
  borderTop: '1px solid #555',
  borderBottom: '1px solid black',
  padding: 10,
  cursor: 'pointer',
  paddingLeft: 10,
}
const activeStyles: React.CSSProperties = {
  borderLeft: 'none',
  borderTop: '1px solid $555',
  backgroundColor: '#111',
  marginLeft: '-1px',
  paddingLeft: 12,
}
export interface ApplicationLogSideBarPropsT {
  activeKey: string
  setActiveKey: (key: string) => void
}
export const ApplicationLogSideBar = (props: ApplicationLogSideBarPropsT) => {
  const { activeKey, setActiveKey } = props
  return (
    <FlexContainer $direction='column'>
      {options.map((option, i) => (
        <div
          key={option.key}
          onClick={() => setActiveKey(option.key)}
          style={{
            ...baseStyles,
            ...(option.key === activeKey ? activeStyles : {}),
            ...(i === 0 ? { borderTop: 'none' } : {}),
          }}
        >
          <Icon src={option.icon} size={24} />
        </div>
      ))}
      <div style={{ ...baseStyles, cursor: 'default', flex: 1 }} />
    </FlexContainer>
  )
}
