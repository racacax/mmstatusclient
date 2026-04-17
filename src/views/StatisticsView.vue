<script setup lang="ts">
import GlobalStatisticsComponent from '@/components/stats/global/GlobalStatisticsComponent.vue'
import { ref, watch, watchEffect, computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import PlayersGlobalStatisticsComponent from '@/components/stats/global/PlayersGlobalStatisticsComponent.vue'
import CountryStatsComponent from '@/components/stats/country/CountryStatsComponent.vue'
import CountryActivityComponent from '@/components/stats/country/CountryActivityComponent.vue'
import PlayersPerCountryComponent from '@/components/stats/country/PlayersPerCountryComponent.vue'
import CountryWinsComponent from '@/components/stats/country/CountryWinsComponent.vue'
import RankDistributionEvolutionComponent from '@/components/stats/ranks/RankDistributionEvolutionComponent.vue'
import RankDistributionPercentageEvolutionComponent from '@/components/stats/ranks/RankDistributionPercentageEvolutionComponent.vue'
import LeaderboardByCountryComponent from '@/components/stats/leaderboard/LeaderboardByCountryComponent.vue'
import CountriesLeaderboardComponent from '@/components/stats/leaderboard/CountriesLeaderboardComponent.vue'
import ClubsLeaderboardComponent from '@/components/stats/leaderboard/ClubsLeaderboardComponent.vue'
import GlobalLeaderboardComponent from '@/components/stats/leaderboard/GlobalLeaderboardComponent.vue'
import CountryH2HComponent from '@/components/stats/leaderboard/CountryH2HComponent.vue'
import HotThisWeekComponent from '@/components/stats/leaderboard/HotThisWeekComponent.vue'
import HotThisWeekByPointsDeltaComponent from '@/components/stats/leaderboard/HotThisWeekByPointsDeltaComponent.vue'
import NewPlayersPerWeekComponent from '@/components/stats/leaderboard/NewPlayersPerWeekComponent.vue'
import PlayerRetentionComponent from '@/components/stats/leaderboard/PlayerRetentionComponent.vue'
import GlobalActivityHeatmapComponent from '@/components/stats/leaderboard/GlobalActivityHeatmapComponent.vue'
import CrossRankFrequencyComponent from '@/components/stats/leaderboard/CrossRankFrequencyComponent.vue'
import ActivityPerDayOfWeekComponent from '@/components/stats/leaderboard/ActivityPerDayOfWeekComponent.vue'
import MapRankDistributionComponent from '@/components/stats/leaderboard/MapRankDistributionComponent.vue'
import PeriodFilterComponent from '@/components/basic/PeriodFilterComponent.vue'

const route = useRoute()
const router = useRouter()

const initialSeasonId = route.query.season ? parseInt(route.query.season as string) : undefined

const periodFilter = ref()
const currentSeasonId = ref<number | undefined>(undefined)
const periodFilterReady = ref(false)
const isCurrentSeason = computed(() => {
  const seasonResult = periodFilter.value?.seasonResult
  if (!seasonResult) return false
  return seasonResult.end_time * 1000 >= Date.now()
})
watchEffect(() => {
  currentSeasonId.value = periodFilter.value?.season ?? undefined
  periodFilterReady.value = periodFilter.value?.ready ?? false
})
watch(currentSeasonId, (id) => {
  if (id !== undefined) router.replace({ params: route.params, query: { season: String(id) } })
})

const VALID_TABS = ['leaderboard', 'activity', 'maps', 'country', 'ranks']
const currentTab = ref(
  VALID_TABS.includes(route.params.tabName as string)
    ? (route.params.tabName as string)
    : 'leaderboard'
)
watch(
  () => route.params?.tabName,
  (tabName) => {
    if (tabName && VALID_TABS.includes(tabName as string)) {
      currentTab.value = tabName as string
    }
  }
)
</script>

<template>
  <div class="d-flex flex-md-row-reverse flex-column align-items-end">
    <div class="justify-content-end d-flex mb-2">
      <div class="p-2 border rounded-top">
        <PeriodFilterComponent
          ref="periodFilter"
          :allow-time-range="false"
          :initial-season-id="initialSeasonId"
        />
      </div>
    </div>
    <nav class="w-100">
      <div class="mb-1">
        <h2>Statistics</h2>
        <span>Shows different statistics for selected matchmaking season.</span>
      </div>
      <div class="nav nav-tabs mb-2" id="nav-tab" role="tablist">
        <RouterLink
          class="nav-link"
          :class="{ active: currentTab === 'leaderboard' }"
          role="tab"
          :to="`/statistics/tab/leaderboard`"
          >Leaderboard</RouterLink
        >

        <RouterLink
          class="nav-link"
          :class="{ active: currentTab === 'activity' }"
          role="tab"
          :to="`/statistics/tab/activity`"
          >Activity</RouterLink
        >

        <RouterLink
          class="nav-link"
          :class="{ active: currentTab === 'maps' }"
          role="tab"
          :to="`/statistics/tab/maps`"
          >Maps</RouterLink
        >

        <RouterLink
          class="nav-link"
          :class="{ active: currentTab === 'country' }"
          role="tab"
          :to="`/statistics/tab/country`"
          >Country</RouterLink
        >

        <RouterLink
          class="nav-link"
          :class="{ active: currentTab === 'ranks' }"
          role="tab"
          :to="`/statistics/tab/ranks`"
          >Ranks</RouterLink
        >
      </div>
    </nav>
  </div>

  <div class="w-100">
    <div
      class="tab-content"
      id="nav-tabContent"
      v-if="periodFilterReady && currentSeasonId !== undefined"
    >
      <div
        class="tab-pane fade"
        :class="{ 'show active': currentTab === 'leaderboard' }"
        role="tabpanel"
      >
        <div class="row mt-2 w-100 gx-0" v-if="currentTab === 'leaderboard'">
          <GlobalLeaderboardComponent :season="currentSeasonId" />
          <LeaderboardByCountryComponent :season="currentSeasonId" />
          <ClubsLeaderboardComponent :season="currentSeasonId" />
          <CountriesLeaderboardComponent :season="currentSeasonId" />
        </div>
      </div>

      <div
        class="tab-pane fade"
        :class="{ 'show active': currentTab === 'activity' }"
        role="tabpanel"
      >
        <div class="row mt-2 w-100 gx-0" v-if="currentTab === 'activity'">
          <PlayersGlobalStatisticsComponent :season="currentSeasonId" />
          <ActivityPerDayOfWeekComponent :season="currentSeasonId" />
          <HotThisWeekComponent v-if="isCurrentSeason" :season="currentSeasonId" />
          <HotThisWeekByPointsDeltaComponent v-if="isCurrentSeason" :season="currentSeasonId" />
          <NewPlayersPerWeekComponent :season="currentSeasonId" />
          <PlayerRetentionComponent :season="currentSeasonId" />
          <GlobalActivityHeatmapComponent :season="currentSeasonId" />
        </div>
      </div>

      <div class="tab-pane fade" :class="{ 'show active': currentTab === 'maps' }" role="tabpanel">
        <div class="row mt-2 w-100 gx-0" v-if="currentTab === 'maps'">
          <GlobalStatisticsComponent :season="currentSeasonId" />
          <MapRankDistributionComponent :season="currentSeasonId" />
        </div>
      </div>

      <div
        class="tab-pane fade"
        :class="{ 'show active': currentTab === 'country' }"
        role="tabpanel"
      >
        <div class="row mt-2 w-100 gx-0" v-if="currentTab === 'country'">
          <CountryStatsComponent :season="currentSeasonId" />
          <CountryActivityComponent :season="currentSeasonId" />
          <PlayersPerCountryComponent :season="currentSeasonId" />
          <CountryWinsComponent :season="currentSeasonId" />
          <CountryH2HComponent :season="currentSeasonId" />
        </div>
      </div>

      <div class="tab-pane fade" :class="{ 'show active': currentTab === 'ranks' }" role="tabpanel">
        <div class="row mt-2 w-100 gx-0" v-if="currentTab === 'ranks'">
          <RankDistributionEvolutionComponent :season="currentSeasonId" />
          <RankDistributionPercentageEvolutionComponent :season="currentSeasonId" />
          <CrossRankFrequencyComponent :season="currentSeasonId" />
        </div>
      </div>
    </div>
  </div>
</template>
