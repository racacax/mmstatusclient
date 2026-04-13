<script setup lang="ts">
import { computed } from 'vue'
import { APIClient } from '@/api/client'
import ActiveMatchesPerRankComponent from '@/components/stats/overview/ActiveMatchesPerRankComponent.vue'
import LeaderboardPodiumComponent from '@/components/stats/overview/LeaderboardPodiumComponent.vue'
import TopCountryComponent from '@/components/stats/overview/TopCountryComponent.vue'
import TopClubComponent from '@/components/stats/overview/TopClubComponent.vue'
import HotThisWeekOverviewComponent from '@/components/stats/overview/HotThisWeekOverviewComponent.vue'
import HotThisWeekDeltaOverviewComponent from '@/components/stats/overview/HotThisWeekDeltaOverviewComponent.vue'
import NewPlayersOverviewComponent from '@/components/stats/overview/NewPlayersOverviewComponent.vue'
import PlayerRetentionOverviewComponent from '@/components/stats/overview/PlayerRetentionOverviewComponent.vue'
import MostPlayedMapMiniCard from '@/components/stats/overview/MostPlayedMapMiniCard.vue'
import MostActivePlayerMiniCard from '@/components/stats/overview/MostActivePlayerMiniCard.vue'
import TotalPlayersMiniCard from '@/components/stats/overview/TotalPlayersMiniCard.vue'
import MostActiveCountryMiniCard from '@/components/stats/overview/MostActiveCountryMiniCard.vue'
import LoadingComponent from '@/components/basic/LoadingComponent.vue'
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons/faCircleExclamation'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
const { data: seasonsData } = APIClient.getSeasons()

const currentSeason = computed(() => {
  if (!seasonsData.value) return null
  const now = Date.now() / 1000
  const seasons = seasonsData.value.results.filter((s) => !s.is_aggregated)
  return (
    seasons.find((s) => s.start_time <= now && s.end_time >= now) ??
    seasons[seasons.length - 1] ??
    null
  )
})
const isNewSeason = computed(() => {
  return currentSeason.value && currentSeason.value.start_time > new Date().getTime() / 1000 - 86400
})
</script>

<template>
  <div class="w-100">
    <h2>Overview</h2>
    <span>Shows overview statistics about current season</span>
    <LoadingComponent v-if="currentSeason === null || currentSeason.id === null" />
    <div v-else class="row gx-0 mt-2 w-100">
      <div class="col-12 px-1">
        <div v-if="isNewSeason" class="alert alert-info w-100" role="alert">
          <FontAwesomeIcon :icon="faCircleExclamation" /> Season just started, some statistics might
          take a few hours to be computed. Non-live statistics are computed every 12 hours.
        </div>
      </div>
      <LeaderboardPodiumComponent :season="currentSeason.id" />
      <div class="col-lg-4 col-12 row gx-0">
        <TopCountryComponent :season="currentSeason.id" />
        <TopClubComponent :season="currentSeason.id" />
        <ActiveMatchesPerRankComponent />
      </div>
      <HotThisWeekDeltaOverviewComponent :season="currentSeason.id" />

      <HotThisWeekOverviewComponent :season="currentSeason.id" />
      <div class="col-lg-4 col-12 row gx-0">
        <NewPlayersOverviewComponent :season="currentSeason.id" />
        <MostPlayedMapMiniCard :season="currentSeason.id" />
        <MostActivePlayerMiniCard :season="currentSeason.id" />
      </div>
      <div class="col-lg-4 col-12 row gx-0">
        <PlayerRetentionOverviewComponent :season="currentSeason.id" />
        <TotalPlayersMiniCard :season="currentSeason.id" />
        <MostActiveCountryMiniCard :season="currentSeason.id" />
      </div>
    </div>
  </div>
</template>
<style></style>
