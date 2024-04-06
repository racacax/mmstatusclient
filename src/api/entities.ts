export interface Player {
  name: string
  uuid: string
  rank: number
  points: number
  last_active: number
  last_game_finished: boolean

  games_last_24_hours: string
  games_last_week: string
  games_last_month: string
  last_game_id: number
}

export interface Game {
  id: number
  map: Map
  time: number
  min_elo: number
  max_elo: number
  average_elo: number
  is_finished: boolean
}

export interface Map {
  name: string
  uid: string
}

export interface Status {
  b1: B1 | null
  b2: B1 | null
  b3: B1 | null
  s1: B1 | null
  s2: B1 | null
  s3: B1 | null
  g1: B1 | null
  g2: B1 | null
  g3: B1 | null
  m1: B1 | null
  m2: B1 | null
  m3: B1 | null
  tm: B1 | null
}

export interface B1 {
  last_time: number
  count: number
}
