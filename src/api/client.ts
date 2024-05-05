import {
  type CountryAndHourStats,
  type CountryStats,
  type Game,
  type MapsStatistics,
  type OpponentsStatistics,
  type Player,
  type PlayerMapStatistics,
  type PlayerPoints,
  type PlayerRanks,
  type PlayersStatistics,
  type PlayerStatistics,
  type SearchPlayer,
  type SeasonResults,
  type Status
} from '@/api/entities'

function fetchAndCatch(url: string) {
  return fetch(url)
    .then((r) => r.json())
    .catch(() => alert('An error occurred while fetching data.'))
}
export class APIClient {
  //@ts-ignore
  static BASE_URL = window.BASE_URL
  static getPlayers(
    minElo: number,
    maxElo: number,
    minRank: number,
    maxRank: number,
    name: string,
    page: number
  ): Promise<Player[]> {
    return fetchAndCatch(
      this.BASE_URL +
        `/api/players?page=${page}&min_elo=${minElo}&max_elo=${maxElo}&min_rank=${minRank}&max_rank=${maxRank}&name=${name}`
    )
  }
  static getLastGames(minElo: number, maxElo: number, page: number): Promise<Game[]> {
    return fetchAndCatch(
      this.BASE_URL + `/api/games?min_elo=${minElo}&max_elo=${maxElo}&page=${page}`
    )
  }

  static getStatus(minDate: Date, maxDate: Date): Promise<Status> {
    return fetchAndCatch(
      this.BASE_URL +
        `/api/status?min_date=${Math.round(minDate.getTime() / 1000)}&max_date=${Math.round(maxDate.getTime() / 1000)}`
    )
  }
  static getMapsStatistics(minDate: Date, maxDate: Date): Promise<MapsStatistics> {
    return fetchAndCatch(
      this.BASE_URL +
        `/api/maps_statistics?min_date=${Math.round(minDate.getTime() / 1000)}&max_date=${Math.round(maxDate.getTime() / 1000)}`
    )
  }
  static getPlayerOpponentsStatistics(
    minDate: Date,
    maxDate: Date,
    player: string,
    orderBy: string,
    order: 'desc' | 'asc',
    page = 1
  ): Promise<OpponentsStatistics> {
    return fetchAndCatch(
      this.BASE_URL +
        `/api/player_opponents_statistics?min_date=${Math.round(minDate.getTime() / 1000)}&max_date=${Math.round(maxDate.getTime() / 1000)}&player=${player}&order_by=${orderBy}&order=${order}&page=${page}`
    )
  }
  static getPlayerStatistics(
    minDate: Date,
    maxDate: Date,
    player: string
  ): Promise<PlayerStatistics> {
    return fetchAndCatch(
      this.BASE_URL +
        `/api/player_statistics?min_date=${Math.round(minDate.getTime() / 1000)}&max_date=${Math.round(maxDate.getTime() / 1000)}&player=${player}`
    )
  }
  static getPlayerPoints(minDate: Date, maxDate: Date, player: string): Promise<PlayerPoints> {
    return fetchAndCatch(
      this.BASE_URL +
        `/api/player_points?min_date=${Math.round(minDate.getTime() / 1000)}&max_date=${Math.round(maxDate.getTime() / 1000)}&player=${player}`
    )
  }
  static getPlayerRanks(minDate: Date, maxDate: Date, player: string): Promise<PlayerRanks> {
    return fetchAndCatch(
      this.BASE_URL +
        `/api/player_ranks?min_date=${Math.round(minDate.getTime() / 1000)}&max_date=${Math.round(maxDate.getTime() / 1000)}&player=${player}`
    )
  }

  static getPlayersStatistics(season: number, orderBy: string): Promise<PlayersStatistics> {
    return fetchAndCatch(
      this.BASE_URL + `/api/players_statistics?order_by=${orderBy}&season=${season}`
    )
  }
  static searchPlayer(name: string): Promise<SearchPlayer> {
    return fetchAndCatch(this.BASE_URL + `/api/search_player?name=${name}`)
  }
  static getPlayerMapStatistics(
    minDate: Date,
    maxDate: Date,
    player: string,
    orderBy: string,
    order: 'desc' | 'asc',
    page = 1
  ): Promise<PlayerMapStatistics> {
    return fetchAndCatch(
      this.BASE_URL +
        `/api/player_map_statistics?min_date=${Math.round(minDate.getTime() / 1000)}&max_date=${Math.round(maxDate.getTime() / 1000)}&player=${player}&order_by=${orderBy}&order=${order}&page=${page}`
    )
  }

  static getSeasons(): Promise<SeasonResults> {
    return fetchAndCatch(this.BASE_URL + `/api/seasons`)
  }

  static getActivityPerCountry(season: number, minElo: number): Promise<CountryStats> {
    return fetchAndCatch(
      this.BASE_URL + `/api/activity_per?metric=country&min_elo=${minElo}&season=${season}`
    )
  }
  static getPlayersPerCountry(season: number, minElo: number): Promise<CountryStats> {
    return fetchAndCatch(
      this.BASE_URL +
        `/api/activity_per?metric=players_per_country&min_elo=${minElo}&season=${season}`
    )
  }

  static getActivityPerCountryAndHour(
    season: number,
    minElo: number
  ): Promise<CountryAndHourStats> {
    return fetchAndCatch(
      this.BASE_URL + `/api/activity_per?metric=country_and_hour&min_elo=${minElo}&season=${season}`
    )
  }
}
