import playoffs from 'data/playoffs.json'

export type PlayoffT = (typeof playoffs)[number]
export type GameT = PlayoffT['games'][number]
export type VhsT = GameT['vhs']
