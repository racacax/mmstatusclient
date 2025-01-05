<script setup lang="ts">
import GlobalStatisticsComponent from '@/components/stats/global/GlobalStatisticsComponent.vue'
import { ref, watch } from 'vue'
import { getEventValue, toTimestamp } from '@/utils'
import { APIClient } from '@/api/client'
import { type SeasonResult } from '@/api/entities'
import { RouterLink, useRoute } from 'vue-router'
import PlayersGlobalStatisticsComponent from '@/components/stats/global/PlayersGlobalStatisticsComponent.vue'
import LoadingComponent from '@/components/basic/LoadingComponent.vue'
import CountryStatsComponent from '@/components/stats/country/CountryStatsComponent.vue'
import CountryActivityComponent from '@/components/stats/country/CountryActivityComponent.vue'
import PlayersPerCountryComponent from '@/components/stats/country/PlayersPerCountryComponent.vue'
import CountryWinsComponent from '@/components/stats/country/CountryWinsComponent.vue'
import RankDistributionEvolutionComponent from '@/components/stats/ranks/RankDistributionEvolutionComponent.vue'
import RankDistributionPercentageEvolutionComponent from '@/components/stats/ranks/RankDistributionPercentageEvolutionComponent.vue'
import ErrorManager from '@/components/management/ErrorManager.vue'
import LeaderboardByCountryComponent from '@/components/stats/leaderboard/LeaderboardByCountryComponent.vue'
import CountriesLeaderboardComponent from '@/components/stats/leaderboard/CountriesLeaderboardComponent.vue'
import ClubsLeaderboardComponent from '@/components/stats/leaderboard/ClubsLeaderboardComponent.vue'
import PlayerTabComponent from '@/components/stats/player/PlayerTabComponent.vue'

const currentSeasonInput = ref()
const currentSeason = ref<SeasonResult>()
const updateCurrentSeason = (value: string) => {
  currentSeason.value = listSeasons.value?.results.find((e) => e.id === parseInt(value))
}
watch(currentSeasonInput, () => updateCurrentSeason(currentSeasonInput.value.value))

const { data: listSeasons, error: errorSeasons, loading: seasonsLoading } = APIClient.getSeasons()

const route = useRoute()
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
          <select
            ref="currentSeasonInput"
            class="form-select form-select-sm datetime d-inline season-container"
            @change="(event) => updateCurrentSeason(getEventValue(event))"
          >
            <option
              :selected="
                season.start_time < toTimestamp(new Date()) &&
                toTimestamp(new Date()) < season.end_time
              "
              :key="season.id"
              :value="season.id"
              v-for="season in listSeasons?.results"
            >
              {{ season.name }}
            </option>
          </select>
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
              <GlobalStatisticsComponent :season="currentSeason?.id" />
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
              <PlayerTabComponent :current-season="currentSeason" />
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
              <LeaderboardByCountryComponent :season="currentSeason?.id" />
              <ClubsLeaderboardComponent :season="currentSeason?.id" />
              <CountriesLeaderboardComponent :season="currentSeason?.id" />
            </div>
          </div>
        </div>
      </div> </template
  ></ErrorManager>
</template>
<style>
.season-container {
  max-width: 150px;
}
</style>
