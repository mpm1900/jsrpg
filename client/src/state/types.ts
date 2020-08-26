import { CharacterT } from '../types/Character'
import { RollResultT } from '../types/Roll'
import { PartyT } from '../types/Party'

export interface StateT {
  parties: PartyT[]
  rolls: RollResultT[]
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
