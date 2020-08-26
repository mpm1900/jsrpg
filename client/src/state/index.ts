import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rolls from './rolls'
import parties from './parties'

export const makeStore = () =>
  createStore(
    combineReducers({ rolls, parties }),
    compose(applyMiddleware(thunk)),
  )
