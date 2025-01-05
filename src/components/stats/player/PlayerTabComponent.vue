<template>
  <form class="d-flex gap-2 w-100" method="dialog">
    <div class="d-flex gap-2 flex-wrap flex-lg-nowrap align-items-center w-100">
      <label for="searchPlayer" style="white-space: nowrap">Search player: </label>
      <div class="d-flex flex-column w-100">
        <div class="d-flex gap-2 flex-wrap flex-lg-nowrap align-items-center w-100">
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
                <div v-if="playersLoading || listPlayers !== null" class="position-relative">
                  <div
                    class="position-absolute z-2 w-100 card border-top-0 p-2"
                    style="border-top-left-radius: 0; border-top-right-radius: 0"
                  >
                    <div class="position-absolute top-0 d-flex w-100 justify-content-end px-3 py-1">
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
          <div class="w-100 d-flex justify-content-end">
            <div v-if="!currentSeason?.is_aggregated" class="mt-1">
              <span>Statistics between </span
              ><input
                class="form-check-input rounded-1 datetime"
                type="datetime-local"
                ref="minDateInput"
                :value="getLocalDate(minDate)"
                :min="getLocalDate(toDate(currentSeason.start_time))"
                :max="getLocalDate(maxDate)"
              />
              <span> and </span>
              <input
                class="form-check-input rounded-1 datetime"
                ref="maxDateInput"
                type="datetime-local"
                :value="getLocalDate(maxDate)"
                :min="getLocalDate(minDate)"
                :max="getLocalDate(toDate(currentSeason.end_time))"
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
        </div>
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
      :season="currentSeason"
    />
    <PlayerOpponentsStatisticsComponent
      :min-date="minDate"
      :max-date="maxDate"
      :player="currentPlayer"
    />
    <PlayerMapStatisticsComponent :min-date="minDate" :max-date="maxDate" :player="currentPlayer" />
    <PlayerPointsComponent :min-date="minDate" :max-date="maxDate" :player="currentPlayer" />
    <PlayerRanksComponent :min-date="minDate" :max-date="maxDate" :player="currentPlayer" />
    <div class="col-12 col-lg-6 d-flex justify-content-center align-items-center">
      <h5>More statistics soon...</h5>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, type Ref } from 'vue'
import ErrorManager from '@/components/management/ErrorManager.vue'
import { getLocalDate, toDate } from '@/utils'
import PlayerStatisticsComponent from '@/components/stats/player/PlayerStatisticsComponent.vue'
import PlayerMapStatisticsComponent from '@/components/stats/player/PlayerMapStatisticsComponent.vue'
import PlayerOpponentsStatisticsComponent from '@/components/stats/player/PlayerOpponentsStatisticsComponent.vue'
import PlayerPointsComponent from '@/components/stats/player/PlayerPointsComponent.vue'
import PlayerRanksComponent from '@/components/stats/player/PlayerRanksComponent.vue'
import { APIClient } from '@/api/client'
import { useRoute } from 'vue-router'
import type { SeasonResult } from '@/api/entities'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSearch, faWandMagicSparkles, faXmark } from '@fortawesome/free-solid-svg-icons'

const props = defineProps<{ currentSeason: SeasonResult }>()
const minDate = ref(new Date(2024, 3, 8, 17, 0))
const maxDate = ref(new Date())
const route = useRoute()
const currentPlayer: Ref<string | null> = ref(route.params?.playerId?.toString())
watch(
  () => [route.params?.playerId],
  () => (currentPlayer.value = route.params?.playerId?.toString())
)
watch(
  () => [props.currentSeason],
  () => {
    minDate.value = toDate(props.currentSeason.start_time)
    maxDate.value = toDate(props.currentSeason.end_time)
  },
  {
    immediate: true
  }
)
const minDateInput = ref()
const maxDateInput = ref()

const searchBtn = ref()
const searchRef = ref('')
const {
  data: listPlayers,
  error: errorPlayers,
  loading: playersLoading,
  fetchFn: fetchPlayers
} = APIClient.searchPlayer(searchRef, { lazy: true })
const searchString: Ref<HTMLInputElement | null> = ref(null)

const updatePlayersList = () => {
  searchRef.value = searchString.value?.value ?? ''
}
watch([searchRef], () => {
  if (searchRef.value !== '') {
    fetchPlayers()
  }
})
</script>

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
