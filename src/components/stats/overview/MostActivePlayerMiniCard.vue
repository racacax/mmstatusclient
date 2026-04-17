<template>
  <OverviewMiniStatCard
    title="Most Active Player"
    tooltip="Player with the most matches played this season."
    :loading="loading"
    :error="error"
    :main-value="top?.name ?? '—'"
    :sub-value="top ? `${top.played.toLocaleString()} matches` : undefined"
    :link="top ? `/#/player-statistics/${top.uuid}` : undefined"
    link-text="Profile →"
  >
    <template #display>
      <img
        v-if="top?.country"
        :src="`/flags/${top.country.file_name}`"
        :alt="top.country.name"
        class="mini-flag"
      />
    </template>
  </OverviewMiniStatCard>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { APIClient } from '@/api/client'
import OverviewMiniStatCard from './OverviewMiniStatCard.vue'

const props = defineProps<{ season: number }>()
const seasonRef = ref(props.season)
const orderBy = ref('played')
watch(
  () => props.season,
  (v) => {
    seasonRef.value = v
  }
)

const { data, error, loading } = APIClient.getPlayersStatistics(seasonRef, orderBy)
const top = computed(() => data.value?.results[0] ?? null)
</script>

<style scoped>
.mini-flag {
  height: 20px;
  border-radius: 2px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}
</style>
