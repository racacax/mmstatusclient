<template>
  <OverviewMiniStatCard
    title="Total Players"
    tooltip="Total number of ranked players currently active this season."
    :loading="loading"
    :error="error"
    :main-value="total !== null ? total.toLocaleString() : '—'"
    sub-value="active players"
    link="/#/statistics/tab/ranks"
    link-text="Rank stats →"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { APIClient } from '@/api/client'
import OverviewMiniStatCard from './OverviewMiniStatCard.vue'
import type { RankDistributionEvolutionResult } from '@/api/entities'

const props = defineProps<{ season: number }>()
const seasonRef = ref(props.season)
watch(
  () => props.season,
  (v) => {
    seasonRef.value = v
  }
)

const { data, error, loading } = APIClient.getRankDistributionEvolution(seasonRef)

function sumRanks(r: RankDistributionEvolutionResult): number {
  return r.b1 + r.b2 + r.b3 + r.s1 + r.s2 + r.s3 + r.g1 + r.g2 + r.g3 + r.m1 + r.m2 + r.m3 + r.tm
}

const total = computed(() => {
  const results = data.value?.results
  if (!results || results.length === 0) return null
  return sumRanks(results[results.length - 1])
})
</script>
