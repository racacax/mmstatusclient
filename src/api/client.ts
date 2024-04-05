import { type Game, type Player, type Status } from '@/api/entities'

export class APIClient {
  //@ts-ignore
  static BASE_URL = window.BASE_URL
  static getPlayers(
    minElo: number,
    maxElo: number,
    minRank: number,
    maxRank: number,
    name: string
  ): Promise<Player[]> {
    return fetch(
      this.BASE_URL +
        `/api/players?min_elo=${minElo}&max_elo=${maxElo}&min_rank=${minRank}&max_rank=${maxRank}&name=${name}`
    ).then((r) => r.json())
  }
  static getLastGames(minElo: number, maxElo: number): Promise<Game[]> {
    return fetch(this.BASE_URL + `/api/games?min_elo=${minElo}&max_elo=${maxElo}`).then((r) =>
      r.json()
    )
  }

  static getStatus(minDate: Date, maxDate: Date): Promise<Status> {
    return fetch(
      this.BASE_URL +
        `/api/status?min_date=${Math.round(minDate.getTime() / 1000)}&max_date=${Math.round(maxDate.getTime() / 1000)}`
    ).then((r) => r.json())
  }
}
