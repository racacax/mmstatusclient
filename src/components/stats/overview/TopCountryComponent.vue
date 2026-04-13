<template>
  <TopLeaderboardEntryCard
    title="Best Country"
    tooltip="Top country by leaderboard points this season."
    classes="col-6"
    :loading="loading"
    :error="error"
    :name="top?.name"
    :points="top?.points ?? 0"
    link="/#/statistics/tab/leaderboard"
    link-text="Full ranking →"
  >
    <template #display>
      <img v-if="top" :src="`/flags/${top.file_name}`" :alt="top.name" class="country-flag" />
    </template>
  </TopLeaderboardEntryCard>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { APIClient } from '@/api/client'
import TopLeaderboardEntryCard from './TopLeaderboardEntryCard.vue'

const props = defineProps<{ season: number }>()
const seasonRef = ref(props.season)
watch(
  () => props.season,
  (v) => {
    seasonRef.value = v
  }
)

const { data: leaderboard, error, loading } = APIClient.getCountriesLeaderboard(seasonRef)
const top = computed(() => leaderboard.value?.results[0] ?? null)
</script>

<style scoped>
.country-flag {
  width: 80px;
  height: 56px;
  object-fit: cover;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
</style>
