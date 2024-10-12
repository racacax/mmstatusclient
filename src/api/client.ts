import {
  type ClubsLeaderboard,
  type Countries,
  type CountriesLeaderboard,
  type CountryAndHourStats,
  type CountryStats,
  type Game,
  type Leaderboard,
  type MapsStatistics,
  type OpponentsStatistics,
  type Player,
  type PlayerMapStatistics,
  type PlayerPoints,
  type PlayerRanks,
  type PlayersStatistics,
  type PlayerStatistics,
  type RankDistributionEvolution,
  type SearchPlayer,
  type SeasonResults,
  type Status
} from '@/api/entities'
import { ref, type Ref, watch } from 'vue'

export type FetchReturn<T> = {
  error: Ref<string | null>
  data: Ref<T | null>
  loading: Ref<boolean>
  fetchFn: () => Promise<void>
}

export type Options = {
  lazy?: boolean
}
function fetchAndCatch<T>(url: Ref<string>, options: Options): FetchReturn<T> {
  const error: Ref<string | null> = ref(null)
  const data: Ref<T | null> = ref(null)
  const loading: Ref<boolean> = ref(false)
  const fetchFn = () => {
    error.value = null
    loading.value = true
    data.value = null
    return fetch(url.value)
      .then((r) => {
        if (r.status >= 400) {
          return r.json().then((j) => {
            throw new Error(j.message ?? 'Unknown error')
          })
        }
        return r.json()
      })
      .catch((e) => {
        error.value = e.toString()
        loading.value = false
      })
      .then((v) => {
        data.value = v
        loading.value = false
      })
  }
  if (!options.lazy) {
    watch([url], fetchFn)
    fetchFn()
  }

  return { error, data, loading, fetchFn }
}

function urlManager<T>(getUrl: () => string, refs: Ref<any>[], options: Options): FetchReturn<T> {
  const url = ref<string>(getUrl())
  watch(refs, () => {
    url.value = getUrl()
  })
  return fetchAndCatch(url, options)
}

export class APIClient {
  static BASE_URL = import.meta.env.VITE_API_BASE_URL
  static getPlayers(
    minElo: Ref<number>,
    maxElo: Ref<number>,
    minRank: Ref<number>,
    maxRank: Ref<number>,
    name: Ref<string>,
    page: Ref<number>,
    computeMatchesPlayed: Ref<boolean>,
    options: Options
  ): FetchReturn<Player[]> {
    const getUrl = () => {
      return (
        this.BASE_URL +
        `/api/players?page=${page.value}&min_elo=${minElo.value}&max_elo=${maxElo.value}&min_rank=${minRank.value}&max_rank=${maxRank.value}&name=${name.value}&compute_matches_played=${computeMatchesPlayed.value}`
      )
    }
    return urlManager(
      getUrl,
      [minElo, maxElo, minRank, maxRank, name, page, computeMatchesPlayed],
      options
    )
  }
  static getLastGames(
    minElo: Ref<number>,
    maxElo: Ref<number>,
    page: Ref<number>,
    options: Options
  ): FetchReturn<Game[]> {
    const getUrl = () => {
      return (
        this.BASE_URL +
        `/api/games?min_elo=${minElo.value}&max_elo=${maxElo.value}&page=${page.value}`
      )
    }
    return urlManager(getUrl, [minElo, maxElo, page], options)
  }

  static getStatus(minDate: Ref<Date>, maxDate: Ref<Date>, options: Options): FetchReturn<Status> {
    const getUrl = () => {
      return (
        this.BASE_URL +
        `/api/status?min_date=${Math.round(minDate.value.getTime() / 1000)}&max_date=${Math.round(maxDate.value.getTime() / 1000)}`
      )
    }
    return urlManager(getUrl, [minDate, maxDate], options)
  }
  static getMapsStatistics(
    season: Ref<number>,
    options: Options = {}
  ): FetchReturn<MapsStatistics> {
    const getUrl = () => {
      return this.BASE_URL + `/api/computed_metric?metric=maps_statistics&season=${season.value}`
    }
    return urlManager(getUrl, [season], options)
  }
  static getPlayerOpponentsStatistics(
    minDate: Ref<Date>,
    maxDate: Ref<Date>,
    player: Ref<string>,
    orderBy: Ref<string>,
    order: Ref<'desc' | 'asc'>,
    page: Ref<number> = ref(1),
    options: Options = {}
  ): FetchReturn<OpponentsStatistics> {
    const getUrl = () => {
      return (
        this.BASE_URL +
        `/api/player_opponents_statistics?min_date=${Math.round(minDate.value.getTime() / 1000)}&max_date=${Math.round(maxDate.value.getTime() / 1000)}&player=${player.value}&order_by=${orderBy.value}&order=${order.value}&page=${page.value}`
      )
    }
    return urlManager(getUrl, [minDate, maxDate, player, orderBy, order, page], options)
  }
  static getPlayerStatistics(
    minDate: Ref<Date>,
    maxDate: Ref<Date>,
    player: Ref<string>,
    options: Options = {}
  ): FetchReturn<PlayerStatistics> {
    const getUrl = () => {
      return (
        this.BASE_URL +
        `/api/player_statistics?min_date=${Math.round(minDate.value.getTime() / 1000)}&max_date=${Math.round(maxDate.value.getTime() / 1000)}&player=${player.value}`
      )
    }
    return urlManager(getUrl, [minDate, maxDate, player], options)
  }
  static getPlayerPoints(
    minDate: Ref<Date>,
    maxDate: Ref<Date>,
    player: Ref<string>,
    options: Options = {}
  ): FetchReturn<PlayerPoints> {
    const getUrl = () => {
      return (
        this.BASE_URL +
        `/api/player_points?min_date=${Math.round(minDate.value.getTime() / 1000)}&max_date=${Math.round(maxDate.value.getTime() / 1000)}&player=${player.value}`
      )
    }
    return urlManager(getUrl, [minDate, maxDate, player], options)
  }
  static getPlayerRanks(
    minDate: Ref<Date>,
    maxDate: Ref<Date>,
    player: Ref<string>,
    options: Options = {}
  ): FetchReturn<PlayerRanks> {
    const getUrl = () => {
      return (
        this.BASE_URL +
        `/api/player_ranks?min_date=${Math.round(minDate.value.getTime() / 1000)}&max_date=${Math.round(maxDate.value.getTime() / 1000)}&player=${player.value}`
      )
    }
    return urlManager(getUrl, [minDate, maxDate, player], options)
  }

  static getPlayersStatistics(
    season: Ref<number>,
    orderBy: Ref<string>,
    options: Options = {}
  ): FetchReturn<PlayersStatistics> {
    const getUrl = () => {
      return (
        this.BASE_URL + `/api/players_statistics?order_by=${orderBy.value}&season=${season.value}`
      )
    }
    return urlManager(getUrl, [orderBy, season], options)
  }
  static searchPlayer(name: Ref<string>, options: Options = {}): FetchReturn<SearchPlayer> {
    const getUrl = () => {
      return this.BASE_URL + `/api/search_player?name=${name.value}`
    }
    return urlManager(getUrl, [name], options)
  }
  static getPlayerMapStatistics(
    minDate: Ref<Date>,
    maxDate: Ref<Date>,
    player: Ref<string>,
    orderBy: Ref<string>,
    order: Ref<'desc' | 'asc'>,
    page: Ref<number> = ref(1),
    options: Options = {}
  ): FetchReturn<PlayerMapStatistics> {
    const getUrl = () => {
      return (
        this.BASE_URL +
        `/api/player_map_statistics?min_date=${Math.round(minDate.value.getTime() / 1000)}&max_date=${Math.round(maxDate.value.getTime() / 1000)}&player=${player.value}&order_by=${orderBy.value}&order=${order.value}&page=${page.value}`
      )
    }
    return urlManager(getUrl, [minDate, maxDate, player, orderBy, order, page], options)
  }

  static getSeasons(options: Options = {}): FetchReturn<SeasonResults> {
    const getUrl = () => {
      return this.BASE_URL + `/api/seasons`
    }
    return urlManager(getUrl, [], options)
  }

  static getActivityPerCountry(
    season: Ref<number>,
    minElo: Ref<number>,
    options: Options = {}
  ): FetchReturn<CountryStats> {
    const getUrl = () => {
      return (
        this.BASE_URL +
        `/api/activity_per?metric=country&min_elo=${minElo.value}&season=${season.value}`
      )
    }
    return urlManager(getUrl, [season, minElo], options)
  }
  static getPlayersPerCountry(
    season: Ref<number>,
    minElo: Ref<number>,
    options: Options = {}
  ): FetchReturn<CountryStats> {
    const getUrl = () => {
      return (
        this.BASE_URL +
        `/api/activity_per?metric=players_per_country&min_elo=${minElo.value}&season=${season.value}`
      )
    }
    return urlManager(getUrl, [season, minElo], options)
  }

  static getActivityPerCountryAndHour(
    season: Ref<number>,
    minElo: Ref<number>,
    options: Options = {}
  ): FetchReturn<CountryAndHourStats> {
    const getUrl = () => {
      return (
        this.BASE_URL +
        `/api/activity_per?metric=country_and_hour&min_elo=${minElo.value}&season=${season.value}`
      )
    }
    return urlManager(getUrl, [season, minElo], options)
  }

  static getRankDistributionEvolution(
    season: Ref<number>,
    options: Options = {}
  ): FetchReturn<RankDistributionEvolution> {
    const getUrl = () => {
      return this.BASE_URL + `/api/computed_metric?metric=rank_distribution&season=${season.value}`
    }
    return urlManager(getUrl, [season], options)
  }
  static getLeaderboard(
    metric: Ref<string>,
    metricValue: Ref<string>,
    season: Ref<number>,
    options: Options = {}
  ): FetchReturn<Leaderboard> {
    const getUrl = () => {
      return (
        this.BASE_URL +
        `/api/leaderboard?metric=${metric.value}&metric_value=${metricValue.value}&season=${season.value}`
      )
    }
    return urlManager(getUrl, [season, metric, metricValue], options)
  }
  static getCountriesLeaderboard(
    season: Ref<number>,
    options: Options = {}
  ): FetchReturn<CountriesLeaderboard> {
    const getUrl = () => {
      return (
        this.BASE_URL + `/api/computed_metric?metric=countries_leaderboard&season=${season.value}`
      )
    }
    return urlManager(getUrl, [season], options)
  }
  static getClubsLeaderboard(
    season: Ref<number>,
    options: Options = {}
  ): FetchReturn<ClubsLeaderboard> {
    const getUrl = () => {
      return this.BASE_URL + `/api/computed_metric?metric=clubs_leaderboard&season=${season.value}`
    }
    return urlManager(getUrl, [season], options)
  }
  static getCountries(options: Options = {}): FetchReturn<Countries> {
    const getUrl = () => {
      return this.BASE_URL + `/api/countries`
    }
    return urlManager(getUrl, [], options)
  }
}
