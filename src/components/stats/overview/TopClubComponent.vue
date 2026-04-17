<template>
  <TopLeaderboardEntryCard
    title="Best Club"
    tooltip="Top club by leaderboard points this season."
    classes="col-6"
    :loading="loading"
    :error="error"
    :points="top?.points ?? 0"
    link="/#/statistics/tab/leaderboard"
    link-text="Full ranking →"
  >
    <template #display>
      <div v-if="top" class="club-tag-display" v-html="topRendered" />
    </template>
  </TopLeaderboardEntryCard>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { APIClient } from '@/api/client'
import { renderMPStyle } from '@/utils'
import TopLeaderboardEntryCard from './TopLeaderboardEntryCard.vue'

const props = defineProps<{ season: number }>()
const seasonRef = ref(props.season)
watch(
  () => props.season,
  (v) => {
    seasonRef.value = v
  }
)

const { data: leaderboard, error, loading } = APIClient.getClubsLeaderboard(seasonRef)
const top = computed(() => leaderboard.value?.results[0] ?? null)
const topRendered = computed(() => (top.value ? renderMPStyle(top.value.name) : ''))
</script>

<style scoped>
.club-tag-display {
  font-size: 1.6rem;
  padding: 8px 16px;
  border-radius: 8px;
  background: var(--bs-tertiary-bg);
  border: 1px solid var(--bs-border-color);
  line-height: 1.2;
}
</style>
