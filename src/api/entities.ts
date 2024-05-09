export interface Player {
  name: string
  country: Country | null
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

export interface Country {
  name: string
  file_name: string
  alpha3: string
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
  total_games_lost_along: number
  total_games_won_along: number
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

export interface PlayersStatistics {
  last_updated: number
  results: PlayersStatisticsResult[]
}

export interface PlayersStatisticsResult {
  name: string
  uuid: string
  played: number
  wins: number
  losses: number
  mvps: number
}

export interface SeasonResults {
  results: SeasonResult[]
}

export interface SeasonResult {
  id: number
  name: string
  start_time: number
  end_time: number
  is_aggregated: boolean
}

export interface CountryStats {
  results: CountryStatsResult[]
  last_updated: number
}

export interface CountryStatsResult {
  id: number
  name: string
  file_name: string
  country_alpha3: string
  total: number
  wins: string
}

export interface CountryAndHourStats {
  results: CountryAndHourResult[]
}

export interface CountryAndHourResult {
  id: number
  name: string
  file_name: string
  country_alpha3: string
  '0-1': string
  '1-2': string
  '2-3': string
  '3-4': string
  '4-5': string
  '5-6': string
  '6-7': string
  '7-8': string
  '8-9': string
  '9-10': string
  '10-11': string
  '11-12': string
  '12-13': string
  '13-14': string
  '14-15': string
  '15-16': string
  '16-17': string
  '17-18': string
  '18-19': string
  '19-20': string
  '20-21': string
  '21-22': string
  '22-23': string
  '23-24': string
}

export interface PlayerPoints {
  results: PlayerPointsResult[]
  player: string
}

export interface PlayerPointsResult {
  time: number
  points: number
}

export interface PlayerRanks {
  results: PlayerRanksResult[]
  player: string
}

export interface PlayerRanksResult {
  time: number
  rank: number
}

export interface RankDistributionEvolution {
  results: RankDistributionEvolutionResult[]
  last_updated: number
}

export interface RankDistributionEvolutionResult {
  b1: number
  b2: number
  b3: number
  s1: number
  s2: number
  s3: number
  g1: number
  g2: number
  g3: number
  m1: number
  m2: number
  m3: number
  tm: number
  date: number
}
