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
  trackmaster_points_limit: number
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

export interface MapsStatistics {
  results: MapsStatisticsResult[]
}

export interface MapsStatisticsResult {
  map_uid: string
  map_name: string
  total_played: number
}

export interface SearchPlayer {
  results: SearchPlayerResult[]
}

export interface SearchPlayerResult {
  uuid: string
  name: string
}
export interface OpponentsStatistics {
  results: OpponentsStatisticsResult[]
  player: string
}

export interface OpponentsStatisticsResult {
  uuid: string
  name: string
  total_played: number
  total_played_against: number
  total_played_along: number
  total_games_lost_against: number
  total_games_won_against: number
}

export interface PlayerStatistics {
  uuid: string
  name: string
  stats: PlayerStatisticsStats
}

export interface PlayerStatisticsStats {
  season: string
  rank: number
  points: number
  total_played: number
  total_wins: number
  total_losses: number
  total_mvp: number
}

export interface PlayerMapStatistics {
  results: PlayerMapStatisticsResult[]
  player: string
}

export interface PlayerMapStatisticsResult {
  played: number
  wins: number
  mvps: number
  losses: number
  lossrate: number
  mvprate: number
  winrate: number
  map_uid: string
  map_name: string
}
