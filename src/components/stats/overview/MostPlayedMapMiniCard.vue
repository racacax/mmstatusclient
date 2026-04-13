<template>
  <OverviewMiniStatCard
    title="Most Played Map"
    tooltip="Map with the most matches played this season."
    :loading="loading"
    :error="error"
    :main-value="top?.map_name ?? '—'"
    :sub-value="top ? `${top.total_played.toLocaleString()} matches` : undefined"
    link="/#/statistics/tab/global"
    link-text="Map stats →"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { APIClient } from '@/api/client'
import OverviewMiniStatCard from './OverviewMiniStatCard.vue'

const props = defineProps<{ season: number }>()
const seasonRef = ref(props.season)
watch(
  () => props.season,
  (v) => {
    seasonRef.value = v
  }
)

const { data, error, loading } = APIClient.getMapsStatistics(seasonRef)
const top = computed(() => data.value?.results[0] ?? null)
</script>
