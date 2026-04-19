<script setup lang="ts">
import { ref, watch, watchEffect, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { APIClient } from '@/api/client'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSearch, faXmark } from '@fortawesome/free-solid-svg-icons'
import PeriodFilterComponent from '@/components/basic/PeriodFilterComponent.vue'
import ErrorManager from '@/components/management/ErrorManager.vue'
import TextInputComponent from '@/components/basic/TextInputComponent.vue'
import PlayerStatisticsComponent from '@/components/stats/player/PlayerStatisticsComponent.vue'
import PlayerOpponentsStatisticsComponent from '@/components/stats/player/PlayerOpponentsStatisticsComponent.vue'
import PlayerMapStatisticsComponent from '@/components/stats/player/PlayerMapStatisticsComponent.vue'
import PlayerPointsComponent from '@/components/stats/player/PlayerPointsComponent.vue'
import PlayerRanksComponent from '@/components/stats/player/PlayerRanksComponent.vue'
import PlayerActivityHeatmapComponent from '@/components/stats/player/PlayerActivityHeatmapComponent.vue'
import PlayerStatisticsPerRankComponent from '@/components/stats/player/PlayerStatisticsPerRankComponent.vue'
import PlayerPerformanceVsEloComponent from '@/components/stats/player/PlayerPerformanceVsEloComponent.vue'
import PlayerMatchesComponent from '@/components/stats/player/PlayerMatchesComponent.vue'

const periodFilter = ref()
const currentMinDate = ref(new Date())
const currentMaxDate = ref(new Date())
const currentSeasonResult = ref()
const periodFilterReady = ref(false)

watchEffect(() => {
  currentMinDate.value = periodFilter.value?.minDate ?? new Date()
  currentMaxDate.value = periodFilter.value?.maxDate ?? new Date()
  currentSeasonResult.value = periodFilter.value?.seasonResult ?? undefined
  periodFilterReady.value = periodFilter.value?.ready ?? false
})

const route = useRoute()
const router = useRouter()

const initialSeasonId = route.query.season ? parseInt(route.query.season as string) : undefined
const initialMinDate = route.query.min_time
  ? new Date(parseInt(route.query.min_time as string) * 1000)
  : undefined
const initialMaxDate = route.query.max_time
  ? new Date(parseInt(route.query.max_time as string) * 1000)
  : undefined

watch([currentSeasonResult, currentMinDate, currentMaxDate], () => {
  const query: Record<string, string> = {}
  if (currentSeasonResult.value) {
    query.season = String(currentSeasonResult.value.id)
  } else {
    query.min_time = String(Math.round(currentMinDate.value.getTime() / 1000))
    query.max_time = String(Math.round(currentMaxDate.value.getTime() / 1000))
  }
  router.replace({ params: route.params, query })
})

const currentPlayer: Ref<string | null> = ref(route.params?.playerId?.toString() ?? null)
watch(
  () => route.params?.playerId,
  (id) => {
    currentPlayer.value = id?.toString() ?? null
  }
)

function selectPlayer(uuid: string) {
  listPlayers.value = null
  router.push({ name: 'player-statistics-id', params: { playerId: uuid }, query: route.query })
}

const localSearch = ref('')
const searchRef = ref('')
const {
  data: listPlayers,
  error: errorPlayers,
  loading: playersLoading,
  fetchFn: fetchPlayers
} = APIClient.searchPlayer(searchRef, { lazy: true })

const updatePlayersList = () => {
  searchRef.value = localSearch.value
}
watch([searchRef], () => {
  if (searchRef.value !== '') fetchPlayers()
})
</script>

<template>
  <div class="d-flex flex-md-row-reverse flex-column align-items-end position-relative">
    <div class="d-flex justify-content-end align-items-start gap-2 flex-wrap mb-2">
      <form class="d-flex flex-column" method="dialog">
        <div class="p-2 border rounded-top d-flex gap-2 flex-wrap flex-lg-nowrap">
          <div>
            <div class="d-flex gap-2 align-items-end h-100">
              <div class="d-flex h-100">
                <TextInputComponent
                  label="Search player"
                  label-style="margin-bottom: 17px!important;"
                  v-model="localSearch"
                  placeholder="Enter player name..."
                  min-width="220px"
                />
              </div>
              <button
                type="submit"
                @click="updatePlayersList"
                class="btn btn-primary d-flex gap-2 align-items-center"
                style="height: var(--filter-control-height)"
              >
                <FontAwesomeIcon :icon="faSearch" />
                Search
              </button>
            </div>
            <div>
              <ErrorManager :error="errorPlayers">
                <template #body>
                  <div v-if="playersLoading || listPlayers !== null" class="position-relative">
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
                      <div v-if="playersLoading">Loading...</div>
                      <div v-else-if="listPlayers?.results.length === 0" style="color: #c90b0b">
                        No player matching query
                      </div>
                      <div
                        class="d-flex w-100 flex-column"
                        v-for="player in listPlayers?.results"
                        :key="player.uuid"
                      >
                        <a
                          href="#"
                          @click.prevent="selectPlayer(player.uuid)"
                          class="player-result"
                          >{{ player.name }}</a
                        >
                      </div>
                    </div>
                  </div>
                </template>
              </ErrorManager>
            </div>
          </div>
          <PeriodFilterComponent
            ref="periodFilter"
            :allow-time-range="true"
            :initial-season-id="initialSeasonId"
            :initial-min-date="initialMinDate"
            :initial-max-date="initialMaxDate"
          />
        </div>
      </form>
    </div>

    <div class="w-100 mb-4">
      <h2>Player Statistics</h2>
      <span>Shows different statistics about a player for selected matchmaking season.</span>
    </div>

    <hr class="position-absolute bottom-0 left-0 w-100 m-0 mb-2" />
  </div>

  <div
    v-if="!periodFilterReady || currentPlayer === null || currentPlayer === undefined"
    class="w-100 d-flex justify-content-center align-items-center"
    style="height: 150px"
  >
    <span>Search a player to show statistics</span>
  </div>
  <div v-else class="row mt-2 w-100 gx-0">
    <PlayerStatisticsComponent
      :min-date="currentMinDate"
      :max-date="currentMaxDate"
      :player="currentPlayer"
      :season="currentSeasonResult"
    />
    <PlayerOpponentsStatisticsComponent
      :min-date="currentMinDate"
      :max-date="currentMaxDate"
      :player="currentPlayer"
    />
    <PlayerMapStatisticsComponent
      :min-date="currentMinDate"
      :max-date="currentMaxDate"
      :player="currentPlayer"
    />
    <PlayerPointsComponent
      :min-date="currentMinDate"
      :max-date="currentMaxDate"
      :player="currentPlayer"
    />
    <PlayerRanksComponent
      :min-date="currentMinDate"
      :max-date="currentMaxDate"
      :player="currentPlayer"
    />
    <PlayerActivityHeatmapComponent
      :min-date="currentMinDate"
      :max-date="currentMaxDate"
      :player="currentPlayer"
    />
    <PlayerStatisticsPerRankComponent
      :min-date="currentMinDate"
      :max-date="currentMaxDate"
      :player="currentPlayer"
    />
    <PlayerPerformanceVsEloComponent
      :min-date="currentMinDate"
      :max-date="currentMaxDate"
      :player="currentPlayer"
    />
    <PlayerMatchesComponent
      :min-date="currentMinDate"
      :max-date="currentMaxDate"
      :player="currentPlayer"
    />
  </div>
</template>

<style>
.player-result {
  text-decoration: none;
  width: 100%;
}
.player-result:hover {
  background-color: var(--bs-light-bg-subtle);
}
</style>
