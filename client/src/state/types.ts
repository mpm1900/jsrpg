import { PartyT } from '../types/Party'
import { Check2ResultT } from '../types/Roll2'

export interface StateT {
  parties: PartyT[]
  rolls: Check2ResultT[]
}

export interface StateActionT<T = any> {
  type: string
  payload: T
}

export type StateReducerT<TState = any, TAction = any> = (
  state: TState,
  action: StateActionT<TAction>,
) => TState

export type StateCoreT<TState = any, TAction = any> = {
  [key: string]: StateReducerT<TState, TAction> | undefined
}
