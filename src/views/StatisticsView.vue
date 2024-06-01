<script setup lang="ts">
import GlobalStatisticsComponent from '@/components/GlobalStatisticsComponent.vue'
import { type Ref, ref, watch } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSearch, faWandMagicSparkles, faXmark } from '@fortawesome/free-solid-svg-icons'
import { APIClient } from '@/api/client'
import { type SeasonResult } from '@/api/entities'
import PlayerStatisticsComponent from '@/components/PlayerStatisticsComponent.vue'
import PlayerMapStatisticsComponent from '@/components/PlayerMapStatisticsComponent.vue'
import PlayerOpponentsStatisticsComponent from '@/components/PlayerOpponentsStatisticsComponent.vue'
import { RouterLink, useRoute } from 'vue-router'
import { getLocalDate } from '@/utils'
import PlayersGlobalStatisticsComponent from '@/components/PlayersGlobalStatisticsComponent.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import CountryStatsComponent from '@/components/stats/country/CountryStatsComponent.vue'
import CountryActivityComponent from '@/components/stats/country/CountryActivityComponent.vue'
import PlayersPerCountryComponent from '@/components/stats/country/PlayersPerCountryComponent.vue'
import CountryWinsComponent from '@/components/stats/country/CountryWinsComponent.vue'
import PlayerPointsComponent from '@/components/stats/player/PlayerPointsComponent.vue'
import PlayerRanksComponent from '@/components/stats/player/PlayerRanksComponent.vue'
import RankDistributionEvolutionComponent from '@/components/stats/ranks/RankDistributionEvolutionComponent.vue'
import RankDistributionPercentageEvolutionComponent from '@/components/stats/ranks/RankDistributionPercentageEvolutionComponent.vue'
import ErrorManager from '@/components/management/ErrorManager.vue'
import CountryLeaderboardComponent from '@/components/stats/leaderboard/CountryLeaderboardComponent.vue'

const minDate = ref(new Date(2024, 3, 8, 17, 0))
const maxDate = ref(new Date())
const route = useRoute()
const searchString: Ref<HTMLInputElement | null> = ref(null)
const currentPlayer: Ref<string | null> = ref(route.params?.playerId?.toString())
watch(
  () => [route.params?.playerId],
  () => (currentPlayer.value = route.params?.playerId?.toString())
)
const searchBtn = ref()
const minDateInput = ref()
const maxDateInput = ref()
const currentSeasonInput = ref()
const currentSeason = ref<SeasonResult>()
watch(
  () => currentSeasonInput.value,
  (input) => {
    currentSeason.value = listSeasons.value?.results.find((e) => e.id === parseInt(input.value))
  }
)
watch(currentSeason, () => {
  if (currentSeason.value !== undefined) {
    minDate.value = new Date(currentSeason.value.start_time * 1000)
    maxDate.value = new Date(currentSeason.value.end_time * 1000)
  }
})

const searchRef = ref('')
const {
  data: listPlayers,
  error: errorPlayers,
  loading: playersLoading,
  fetchFn: fetchPlayers
} = APIClient.searchPlayer(searchRef, { lazy: true })

const updatePlayersList = () => {
  searchRef.value = searchString.value?.value ?? ''
}
watch([searchRef], () => {
  if (searchRef.value !== '') {
    fetchPlayers()
  }
})

const { data: listSeasons, error: errorSeasons, loading: seasonsLoading } = APIClient.getSeasons()

let isPlayerOpen = !!route.params?.playerId
const currentTab = ref(isPlayerOpen ? 'player' : 'global')
if (route.params.tabName !== undefined) {
  currentTab.value = route.params.tabName as string
}
watch(
  () => [route.params?.tabName],
  () => {
    if (route.params?.tabName !== undefined) {
      currentTab.value = route.params.tabName as string
    }
  }
)
</script>

<template>
  <h2>Statistics</h2>
  <span>Shows different statistics for selected matchmaking season.</span>
  <ErrorManager :error="errorSeasons">
    <template #body>
      <LoadingComponent v-if="seasonsLoading" />
      <div class="w-100" v-else>
        <div>
          <span>Season : </span>
          <select ref="currentSeasonInput" class="form-select form-select-sm datetime d-inline">
            <option
              :selected="
                season.start_time * 1000 < new Date().getTime() &&
                new Date().getTime() < season.end_time
              "
              :key="season.id"
              :value="season.id"
              v-for="season in listSeasons?.results"
            >
              {{ season.name }}
            </option>
          </select>
          <div v-if="!currentSeason?.is_aggregated" class="mt-1">
            <span>Statistics between </span
            ><input
              class="form-check-input rounded-1 datetime"
              type="datetime-local"
              ref="minDateInput"
              :value="getLocalDate(minDate)"
              min="2024-04-01T00:00"
              :max="getLocalDate(maxDate)"
            />
            <span> and </span>
            <input
              class="form-check-input rounded-1 datetime"
              ref="maxDateInput"
              type="datetime-local"
              :value="getLocalDate(maxDate)"
              :min="getLocalDate(minDate)"
            />
            <div
              type="button"
              class="btn btn-primary mx-1"
              @click="
                (e) => {
                  minDate = new Date(minDateInput.value)
                  maxDate = new Date(maxDateInput.value)
                }
              "
            >
              <FontAwesomeIcon :icon="faWandMagicSparkles" />
              Apply
            </div>
          </div>
        </div>
        <nav class="mt-2">
          <div class="nav nav-tabs mb-2" id="nav-tab" role="tablist">
            <RouterLink
              class="nav-link"
              :class="{ active: currentTab == 'global' }"
              id="nav-global-tab"
              type="button"
              role="tab"
              :to="`/statistics/tab/global`"
            >
              Global
            </RouterLink>

            <RouterLink
              class="nav-link"
              :class="{ active: currentTab == 'player' }"
              id="nav-player-tab"
              type="button"
              role="tab"
              :to="`/statistics/tab/player`"
            >
              Player
            </RouterLink>

            <RouterLink
              class="nav-link"
              :class="{ active: currentTab == 'country' }"
              id="nav-country-tab"
              type="button"
              role="tab"
              :to="`/statistics/tab/country`"
            >
              Country
            </RouterLink>

            <RouterLink
              class="nav-link"
              :class="{ active: currentTab == 'ranks' }"
              id="nav-ranks-tab"
              type="button"
              role="tab"
              :to="`/statistics/tab/ranks`"
            >
              Ranks
            </RouterLink>
            <RouterLink
              class="nav-link"
              :class="{ active: currentTab == 'leaderboard' }"
              id="nav-leaderboard-tab"
              type="button"
              role="tab"
              :to="`/statistics/tab/leaderboard`"
            >
              Leaderboard
            </RouterLink>
          </div>
        </nav>

        <div class="tab-content" id="nav-tabContent" v-if="currentSeason !== undefined">
          <div
            class="tab-pane fade"
            :class="{ 'show active': currentTab === 'global' }"
            id="nav-global"
            role="tabpanel"
            aria-labelledby="nav-global-tab"
            tabindex="0"
            ref="tabGlobal"
          >
            <div class="row w-100 gx-0" v-if="currentTab === 'global'">
              <GlobalStatisticsComponent :min-date="minDate" :max-date="maxDate" />
              <PlayersGlobalStatisticsComponent :season="currentSeason?.id" />
              <div
                class="col-12 col-lg-6 d-flex justify-content-center align-items-center"
                style="min-height: 200px"
              >
                <h5>More statistics soon...</h5>
              </div>
            </div>
          </div>
          <div
            class="tab-pane fade"
            :class="{ 'show active': currentTab === 'player' }"
            id="nav-player"
            role="tabpanel"
            aria-labelledby="nav-player-tab"
            tabindex="1"
            ref="tabPlayer"
          >
            <div v-if="currentTab === 'player'">
              <form class="d-flex gap-2" method="dialog">
                <div class="d-flex gap-2 flex-wrap flex-lg-nowrap align-items-center">
                  <label for="searchPlayer" style="white-space: nowrap">Search player: </label>
                  <div class="d-flex flex-column">
                    <div class="d-flex gap-2 flex-wrap flex-lg-nowrap align-items-center">
                      <input
                        id="searchPlayer"
                        type="text"
                        style="max-width: 300px"
                        class="form-control"
                        ref="searchString"
                        placeholder="Enter player name..."
                      />
                      <button
                        type="submit"
                        ref="searchBtn"
                        @click="
                          (e) => {
                            updatePlayersList()
                          }
                        "
                        class="btn btn-primary d-flex gap-2 align-items-center"
                      >
                        <FontAwesomeIcon :icon="faSearch" />
                        Search
                      </button>
                    </div>
                    <ErrorManager :error="errorPlayers">
                      <template #body>
                        <div
                          v-if="!playersLoading && listPlayers !== null"
                          class="position-relative"
                        >
                          <div
                            class="position-absolute z-2 w-100 card border-top-0 p-2"
                            style="border-top-left-radius: 0; border-top-right-radius: 0"
                          >
                            <div
                              class="position-absolute top-0 d-flex w-100 justify-content-end px-3 py-1"
                            >
                              <FontAwesomeIcon
                                :icon="faXmark"
                                style="cursor: pointer"
                                @click="() => (listPlayers = null)"
                              />
                            </div>
                            <strong>Search results:</strong><br />
                            <div v-if="listPlayers?.results.length === 0" style="color: #c90b0b">
                              No player matching query
                            </div>
                            <div
                              class="d-flex w-100 flex-column"
                              v-for="player in listPlayers?.results"
                              :key="player.uuid"
                            >
                              <RouterLink
                                :to="`/statistics/${player.uuid}`"
                                @click="
                                  () => {
                                    currentPlayer = player.uuid
                                    listPlayers = null
                                  }
                                "
                                class="player-result"
                                >{{ player.name }}
                              </RouterLink>
                            </div>
                          </div>
                        </div>
                      </template>
                    </ErrorManager>
                  </div>
                </div>
              </form>

              <div
                v-if="currentPlayer === null || currentPlayer === undefined"
                class="w-100 d-flex justify-content-center align-items-center"
                style="height: 150px"
              >
                <span>Search a player to show statistics</span>
              </div>
              <div v-else class="row mt-2 w-100 gx-0">
                <PlayerStatisticsComponent
                  :min-date="minDate"
                  :max-date="maxDate"
                  :player="currentPlayer"
                />
                <PlayerOpponentsStatisticsComponent
                  :min-date="minDate"
                  :max-date="maxDate"
                  :player="currentPlayer"
                />
                <PlayerMapStatisticsComponent
                  :min-date="minDate"
                  :max-date="maxDate"
                  :player="currentPlayer"
                />
                <PlayerPointsComponent
                  :min-date="minDate"
                  :max-date="maxDate"
                  :player="currentPlayer"
                />
                <PlayerRanksComponent
                  :min-date="minDate"
                  :max-date="maxDate"
                  :player="currentPlayer"
                />
                <div class="col-12 col-lg-6 d-flex justify-content-center align-items-center">
                  <h5>More statistics soon...</h5>
                </div>
              </div>
            </div>
          </div>
          <div
            class="tab-pane fade"
            :class="{ 'show active': currentTab === 'country' }"
            id="nav-activity"
            role="tabpanel"
            aria-labelledby="nav-activity-tab"
            tabindex="2"
            ref="tabActivity"
          >
            <div class="row mt-2 w-100 gx-0" v-if="currentTab === 'country'">
              <CountryStatsComponent :season="currentSeason?.id" />
              <CountryActivityComponent :season="currentSeason?.id" />
              <PlayersPerCountryComponent :season="currentSeason?.id" />
              <CountryWinsComponent :season="currentSeason?.id" />
            </div>
          </div>
          <div
            class="tab-pane fade"
            id="nav-ranks"
            role="tabpanel"
            :class="{ 'show active': currentTab === 'ranks' }"
            aria-labelledby="nav-ranks-tab"
            tabindex="3"
            ref="tabRanks"
          >
            <div class="row mt-2 w-100 gx-0" v-if="currentTab === 'ranks'">
              <RankDistributionEvolutionComponent :season="currentSeason?.id" />
              <RankDistributionPercentageEvolutionComponent :season="currentSeason?.id" />
            </div>
          </div>
          <div
            class="tab-pane fade"
            id="nav-leaderboard"
            role="tabpanel"
            :class="{ 'show active': currentTab === 'leaderboard' }"
            aria-labelledby="nav-leaderboard-tab"
            tabindex="4"
            ref="tabLeaderboard"
          >
            <div class="row mt-2 w-100 gx-0" v-if="currentTab === 'leaderboard'">
              <CountryLeaderboardComponent :season="currentSeason?.id" />
            </div>
          </div>
        </div>
      </div> </template
  ></ErrorManager>
</template>
<style scoped>
.datetime {
  width: 180px;
  height: 38px;
  margin-top: 0;
}

.player-result {
  text-decoration: none;
  width: 100%;
}

.player-result:hover {
  background-color: var(--bs-light-bg-subtle);
}
</style>
