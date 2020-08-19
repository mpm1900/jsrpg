import { createStore, combineReducers } from 'redux'
import characters from './characters'
import rolls from './rolls'

export const makeStore = () =>
  createStore(combineReducers({ characters, rolls }))
