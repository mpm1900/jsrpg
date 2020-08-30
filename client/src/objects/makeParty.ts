import { PartyT } from '../types/Party'
import { v4 } from 'uuid'
import { makeNpc } from './makeNpc'

export const makeParty = (id: string = v4()): PartyT => {
  return {
    id,
    items: [],
    skills: [],
    mods: [],
    characters: [makeNpc(), makeNpc(), makeNpc(), makeNpc(), makeNpc()].map(
      (c) => ({
        ...c,
        partyId: id,
      }),
    ),
  }
}
