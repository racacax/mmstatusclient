import { type Game, type Player, type Status } from '@/api/entities'

function fetchAndCatch(url: string) {
  return fetch(url).then(r => r.json()).catch(() => alert("An error occurred while fetching data."))
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
    return fetchAndCatch(this.BASE_URL + `/api/games?min_elo=${minElo}&max_elo=${maxElo}&page=${page}`)
  }

  static getStatus(minDate: Date, maxDate: Date): Promise<Status> {
    return fetchAndCatch(
      this.BASE_URL +
        `/api/status?min_date=${Math.round(minDate.getTime() / 1000)}&max_date=${Math.round(maxDate.getTime() / 1000)}`
    )
  }
}
