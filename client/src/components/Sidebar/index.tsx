import React, { useMemo } from 'react'
import { BoxContainer } from '../../elements/box'

import { Icon } from '../Icon'
import { FlexContainer } from '../../elements/flex'

export interface SidebarOptionT {
  key: string
  icon: string
  Component: React.FC
}

export interface SidebarPropsT {
  activeKey: string | undefined
  setActiveKey: (key?: string) => void
  options: SidebarOptionT[]
  direction?: 'right' | 'left'
}
export const Sidebar = (props: SidebarPropsT) => {
  const { activeKey, setActiveKey, options, direction = 'right' } = props
  const activeOption = useMemo(() => options.find((o) => o.key === activeKey), [
    activeKey,
  ])
  return (
    <BoxContainer
      substyle={{
        display: 'flex',
        flexDirection: direction === 'right' ? 'row' : 'row-reverse',
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
              boxSizing: 'border-box',
              backgroundColor:
                activeKey === option.key ? '#111' : 'transparent',
              borderTop: i === 0 ? 'none' : '1px solid #555',
              borderBottom: '1px solid black',
              borderRight:
                direction === 'right'
                  ? activeKey && activeKey !== option.key
                    ? '1px solid #555'
                    : 'none'
                  : 'none',
              borderLeft:
                direction === 'left'
                  ? activeKey && activeKey !== option.key
                    ? '1px solid #555'
                    : 'none'
                  : 'none',
            }}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setActiveKey(activeKey === option.key ? undefined : option.key)
            }}
          >
            <Icon src={option.icon} size={24} />
          </div>
        ))}
        <FlexContainer
          $full
          style={{
            borderTop: '1px solid #555',
            borderRight:
              direction === 'right'
                ? activeKey !== undefined
                  ? '1px solid #555'
                  : 'none'
                : 'none',
            borderLeft:
              direction === 'left'
                ? activeKey !== undefined
                  ? '1px solid #555'
                  : 'none'
                : 'none',
          }}
        />
      </FlexContainer>
      {activeOption && (
        <div
          style={{
            padding: 8,
            backgroundColor: '#111',
            overflow: 'auto',
          }}
        >
          <activeOption.Component />
        </div>
      )}
    </BoxContainer>
  )
}
