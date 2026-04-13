<template>
  <OverviewPodiumCard
    title="Top Players"
    tooltip="Top 10 players of the current season."
    :loading="loading"
    :error="error"
    :top3="top3"
    :rest="rest"
    link="/#/statistics/tab/leaderboard"
    link-text="Full leaderboard →"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { APIClient } from '@/api/client'
import { renderMPStyle } from '@/utils'
import OverviewPodiumCard, { type PodiumEntry } from './OverviewPodiumCard.vue'

const props = defineProps<{ season: number }>()
const seasonRef = ref(props.season)
const page = ref(1)
const limit = ref(10)

watch(
  () => props.season,
  (v) => {
    seasonRef.value = v
  }
)

const { data: leaderboard, error, loading } = APIClient.getGlobalLeaderboard(seasonRef, page, limit)

function toEntry(e: NonNullable<typeof leaderboard.value>['results'][0]): PodiumEntry {
  return {
    uuid: e.uuid,
    name: e.name,
    clubTagHtml: e.club_tag ? `[<span>${renderMPStyle(e.club_tag)}</span>]&nbsp;` : undefined,
    flagFile: e.country.file_name,
    primaryValue: `${e.points} pts`
  }
}

const top3 = computed(() => leaderboard.value?.results.slice(0, 3).map(toEntry) ?? [])
const rest = computed(() => leaderboard.value?.results.slice(3, 10).map(toEntry) ?? [])
</script>
