<template>
  <OverviewPodiumCard
    title="Hot This Week (Wins)"
    tooltip="Most active players this week ranked by wins. Master I+ only (3000+ elo)."
    :loading="loading"
    :error="error"
    :top3="top3"
    :rest="rest"
    link="/#/statistics/tab/activity"
    link-text="Full ranking →"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { APIClient } from '@/api/client'
import { renderMPStyle } from '@/utils'
import OverviewPodiumCard, { type PodiumEntry } from './OverviewPodiumCard.vue'
import type { HotThisWeekResult } from '@/api/entities'

const props = defineProps<{ season: number }>()
const seasonRef = ref(props.season)
const minElo = ref(3000)

watch(
  () => props.season,
  (v) => {
    seasonRef.value = v
  }
)

const { data: stats, error, loading } = APIClient.getHotThisWeek(seasonRef, minElo)

function toEntry(e: HotThisWeekResult): PodiumEntry {
  const winRate = e.played > 0 ? ((e.wins / e.played) * 100).toFixed(0) : '0'
  return {
    uuid: e.uuid,
    name: e.name,
    clubTagHtml: e.club_tag ? `[<span>${renderMPStyle(e.club_tag)}</span>]&nbsp;` : undefined,
    flagFile: e.country.file_name,
    primaryValue: `${e.wins}W`,
    secondaryValue: `${winRate}% · ${e.played} played`
  }
}

const all = computed(() => stats.value?.results ?? [])
const top3 = computed(() => all.value.slice(0, 3).map(toEntry))
const rest = computed(() => all.value.slice(3, 10).map(toEntry))
</script>
