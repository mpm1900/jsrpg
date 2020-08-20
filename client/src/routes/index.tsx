import React from 'react'
import { Route } from 'react-router-dom'

export const makeRoute = (path: string, Component: React.FC) => (
  <Route path={path}>
    <Component />
  </Route>
)
