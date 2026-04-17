<template>
  <OverviewMiniStatCard
    title="Most Active Country"
    tooltip="Country with the most player-matches played this season."
    :loading="loading"
    :error="error"
    :main-value="top?.name ?? '—'"
    :sub-value="top ? `${top.total.toLocaleString()} player matches` : undefined"
    link="/#/statistics/tab/country"
    link-text="Country stats →"
  >
    <template #display>
      <img v-if="top" :src="`/flags/${top.file_name}`" :alt="top.name" class="mini-flag" />
    </template>
  </OverviewMiniStatCard>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { APIClient } from '@/api/client'
import OverviewMiniStatCard from './OverviewMiniStatCard.vue'

const props = defineProps<{ season: number }>()
const seasonRef = ref(props.season)
const minElo = ref(0)
watch(
  () => props.season,
  (v) => {
    seasonRef.value = v
  }
)

const { data, error, loading } = APIClient.getActivityPerCountry(seasonRef, minElo)
const top = computed(() => {
  const results = data.value?.results
  if (!results || results.length === 0) return null
  return [...results].sort((a, b) => b.total - a.total)[0]
})
</script>

<style scoped>
.mini-flag {
  height: 20px;
  border-radius: 2px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}
</style>
