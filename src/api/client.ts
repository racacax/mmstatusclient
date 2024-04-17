import {
  type Game,
  type MapsStatistics,
  type OpponentsStatistics,
  type Player,
  type PlayerMapStatistics,
  type PlayerStatistics,
  type SearchPlayer,
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
    order: 'desc' | 'asc'
  ): Promise<OpponentsStatistics> {
    return fetchAndCatch(
      this.BASE_URL +
        `/api/player_opponents_statistics?min_date=${Math.round(minDate.getTime() / 1000)}&max_date=${Math.round(maxDate.getTime() / 1000)}&player=${player}&order_by=${orderBy}&order=${order}`
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
  static searchPlayer(name: string): Promise<SearchPlayer> {
    return fetchAndCatch(this.BASE_URL + `/api/search_player?name=${name}`)
  }
  static getPlayerMapStatistics(
    minDate: Date,
    maxDate: Date,
    player: string,
    orderBy: string,
    order: 'desc' | 'asc'
  ): Promise<PlayerMapStatistics> {
    return fetchAndCatch(
      this.BASE_URL +
        `/api/player_map_statistics?min_date=${Math.round(minDate.getTime() / 1000)}&max_date=${Math.round(maxDate.getTime() / 1000)}&player=${player}&order_by=${orderBy}&order=${order}`
    )
  }
}
