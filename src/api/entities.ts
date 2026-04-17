export interface Player {
  name: string
  country: Country | null
  uuid: string
  club_tag: string | null
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

export interface MapRankDistribution {
  map_uid: string
  map_name: string
  results: MapRankDistributionResult[]
  last_updated: number
}

export interface MapRankDistributionResult {
  rank: string
  name: string
  count: number
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
  country?: Country | null
  country_alpha3?: string
  file_name?: string
  club_tag?: string
  total_played: number
  total_played_against: number
  total_played_along: number
  total_games_lost_against: number
  total_games_won_against: number
  total_games_lost_along: number
  total_games_won_along: number
}

export interface PlayerPerformanceVsElo {
  player: string
  threshold: number
  results: PlayerPerformanceVsEloBucket[]
}

export interface PlayerPerformanceVsEloBucket {
  bucket: 'underdog' | 'even' | 'favorite'
  games_played: number
  wins: number
  losses: number
  win_rate: number
}

export interface PlayerMatches {
  results: PlayerMatchResult[]
  player: string
  page: number
}

export interface PlayerMatchResult {
  id: number
  time: number
  is_finished: boolean
  average_elo: number
  min_elo: number
  map_uid: string
  map_name: string
  is_win: boolean
  is_mvp: boolean
  position: number
  points_after_match: number
  rank_after_match: number
}

export interface PlayerStatisticsPerRank {
  player: string
  results: PlayerStatisticsPerRankResult[]
}

export interface PlayerStatisticsPerRankResult {
  rank: string
  rank_name: string
  played: number
  wins: number
  mvps: number
}

export interface PlayerStatistics {
  uuid: string
  name: string
  club_tag: string | null
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
  most_wins_in_a_row: number
  most_losses_in_a_row: number
  current_win_streak: number
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
  club_tag?: string | null
  country?: { name: string; file_name: string; alpha3: string }
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
  last_updated: number
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

export interface Leaderboard {
  results: LeaderboardResult[]
  last_updated: number
}

export interface LeaderboardResult {
  name: string
  uuid: string
  rank: number
  points: number
  club_tag: string | null
  region: { name: string; file_name: string } | null
}

export interface Countries {
  results: CountriesResult[]
}

export interface CountriesResult {
  id: number
  uuid: string
  name: string
  parent: number
  country_alpha3: string
  file_name: string
}

export interface CountriesLeaderboard {
  last_updated: number
  compute_method?: 'top_10'
  results: CountriesLeaderboardResult[]
}

export interface CountriesLeaderboardResult {
  name: string
  file_name: string
  country_alpha3: string
  points: number
}

export interface ClubsLeaderboard {
  last_updated: number
  compute_method?: 'top_10'
  results: ClubsLeaderboardResult[]
}

export interface ClubsLeaderboardResult {
  name: string
  points: number
}

export interface MatchDetail {
  id: number
  time: number
  is_finished: boolean
  map: Map
  min_elo: number
  max_elo: number
  average_elo: number
  trackmaster_points_limit: number
  rounds: number | null
  players: MatchDetailPlayer[]
}

export interface MatchDetailPlayer {
  uuid: string
  name: string
  position: number | null
  is_win: boolean
  is_mvp: boolean
  score: number | null
  elo_before: number
  elo_after: number | null
  elo_gained: number | null
  rank_after: number | null
}

export interface ActivityPerDayOfWeek {
  last_updated: number
  results: Record<string, number>
}

export interface CrossRankFrequency {
  last_updated: number
  results: CrossRankFrequencyResult[]
}

export interface CrossRankFrequencyResult {
  spread_min: number
  spread_max: number | null
  count: number
}

export interface GlobalActivityHeatmap {
  last_updated: number
  results: PlayerActivityHeatmapResult[]
}

export interface PlayerRetention {
  last_updated: number
  results: PlayerRetentionResult[]
}

export interface PlayerRetentionResult {
  week: number
  week_start: number
  total_players: number
  retained_players: number
  retention_rate: number
}

export interface NewPlayersPerWeek {
  last_updated: number
  results: NewPlayersPerWeekResult[]
}

export interface NewPlayersPerWeekResult {
  week: number
  week_start: number
  new_players: number
}

export interface HotThisWeekByPointsDelta {
  last_updated: number
  results: HotThisWeekByPointsDeltaResult[]
}

export interface HotThisWeekByPointsDeltaResult {
  name: string
  uuid: string
  club_tag: string | null
  country: { name: string; file_name: string; alpha3: string }
  current_points: number
  delta: number
  played: number
}

export interface HotThisWeek {
  last_updated: number
  results: HotThisWeekResult[]
}

export interface HotThisWeekResult {
  name: string
  uuid: string
  club_tag: string | null
  country: { name: string; file_name: string; alpha3: string }
  current_points: number
  wins: number
  played: number
}

export interface CountryH2H {
  results: CountryH2HResult[]
  last_updated: number
}

export interface CountryH2HResult {
  opponent: { name: string; file_name: string; alpha3: string }
  wins: number
  losses: number
  draws: number
  games: number
}

export interface GlobalLeaderboard {
  results: GlobalLeaderboardResult[]
  page: number
  limit: number
  total: number
}

export interface GlobalLeaderboardResult {
  rank: number
  points: number
  name: string
  uuid: string
  club_tag: string | null
  country: {
    name: string
    file_name: string
  }
}

export interface PlayerActivityHeatmap {
  results: PlayerActivityHeatmapResult[]
  player: string
}

export interface PlayerActivityHeatmapResult {
  day: number
  hour: number
  count: number
}

export interface ThreadHealth {
  [threadName: string]: ThreadHealthEntry
}

export interface ThreadHealthEntry {
  is_alive: boolean
  uptime_seconds: number
  seconds_since_last_error: number | null
  error_count: number
}

export interface ActiveMatchRankEntry {
  rank: string
  name: string
  count: number
}

export interface ActiveMatchesPerRank {
  results: ActiveMatchRankEntry[]
}
