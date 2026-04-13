<template>
  <OverviewPodiumCard
    title="Hot This Week (Δ pts)"
    tooltip="Players with the biggest ELO point changes this week. Master I+ only (3000+ elo)."
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
import type { HotThisWeekByPointsDeltaResult } from '@/api/entities'

const props = defineProps<{ season: number }>()
const seasonRef = ref(props.season)
const minElo = ref(3000)

watch(
  () => props.season,
  (v) => {
    seasonRef.value = v
  }
)

const { data: stats, error, loading } = APIClient.getHotThisWeekByPointsDelta(seasonRef, minElo)

function deltaHtml(delta: number): string {
  const color = delta >= 0 ? 'var(--bs-success)' : 'var(--bs-danger)'
  const sign = delta >= 0 ? '+' : ''
  return `<span style="color:${color}">${sign}${delta}</span>`
}

function toEntry(e: HotThisWeekByPointsDeltaResult): PodiumEntry {
  return {
    uuid: e.uuid,
    name: e.name,
    clubTagHtml: e.club_tag ? `[<span>${renderMPStyle(e.club_tag)}</span>]&nbsp;` : undefined,
    flagFile: e.country.file_name,
    primaryValue: deltaHtml(e.delta),
    secondaryValue: `${e.current_points} pts · ${e.played} played`
  }
}

const all = computed(() => stats.value?.results ?? [])
const top3 = computed(() => all.value.slice(0, 3).map(toEntry))
const rest = computed(() => all.value.slice(3, 10).map(toEntry))
</script>
