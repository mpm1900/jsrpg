export interface BattleRoundT {
  [key: string]: {
    targetId: string
    skill: any
  }
}

export interface BattleT {
  rounds: BattleRoundT[]
}
