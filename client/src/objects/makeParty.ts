import { PartyT } from '../types/Party'
import { v4 } from 'uuid'
import { makeNpc } from './makeNpc'

export const makeParty = (id: string = v4()): PartyT => {
  return {
    id,
    items: [],
    characters: [makeNpc(), makeNpc(), makeNpc()].map((c) => ({
      ...c,
      partyId: id,
    })),
  }
}
