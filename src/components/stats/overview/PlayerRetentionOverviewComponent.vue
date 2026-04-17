<template>
  <CardComponent
    classes="col-12"
    title="Player Retention / Week"
    tooltip="Percentage of players from a given week who played again the following week."
  >
    <template #main>
      <ErrorManager :error="error">
        <template #body>
          <LoadingComponent v-if="loading || !data" />
          <template v-else>
            <div class="d-flex align-items-baseline gap-2 mt-1 mb-1 px-1">
              <span class="kpi-number" :class="rateClass(latestRate)">{{ latestRate }}%</span>
              <span class="kpi-label text-muted">retention last week</span>
              <span class="ms-auto kpi-trend" :class="trendClass">{{ trendLabel }}</span>
            </div>

            <table class="retention-table w-100">
              <tbody>
                <tr
                  v-for="r in lastWeeks"
                  :key="r.week_start"
                  :class="{ 'prev-season-row': r.isPrev }"
                >
                  <td class="ret-date">{{ formatDate(r.week_start) }}</td>
                  <td class="ret-counts text-muted">
                    {{ r.retained_players }}/{{ r.total_players }}
                  </td>
                  <td class="ret-rate text-end">
                    <span class="badge-rate" :class="rateClass(pct(r))">{{ pct(r) }}%</span>
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="text-end mt-1">
              <a href="/#/statistics/tab/activity" class="small">Full statistics →</a>
            </div>
          </template>
        </template>
      </ErrorManager>
    </template>
  </CardComponent>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { APIClient } from '@/api/client'
import CardComponent from '@/components/basic/CardComponent.vue'
import LoadingComponent from '@/components/basic/LoadingComponent.vue'
import ErrorManager from '@/components/management/ErrorManager.vue'
import type { PlayerRetentionResult } from '@/api/entities'

const N_PREV_WEEKS = 8

type MergedRow = PlayerRetentionResult & { isPrev?: boolean }

const props = defineProps<{ season: number; prevSeason?: number }>()
const seasonRef = ref(props.season)
const minElo = ref(0)
const prevSeasonRef = ref(props.prevSeason ?? 0)

watch(
  () => props.season,
  (v) => (seasonRef.value = v)
)

const { data, error, loading } = APIClient.getPlayerRetention(seasonRef, minElo)
const { data: prevData, fetchFn: fetchPrev } = APIClient.getPlayerRetention(prevSeasonRef, minElo, {
  lazy: true
})

watch(
  [() => props.prevSeason, () => props.season],
  ([prevSeason]) => {
    if (prevSeason) {
      prevSeasonRef.value = prevSeason
      fetchPrev()
    }
  },
  { immediate: true }
)

const results = computed(() => data.value?.results ?? [])

const mergedResults = computed((): MergedRow[] => {
  const current = results.value
  const prev = prevData.value?.results ?? []
  if (!props.prevSeason || !prev.length) return current
  const needed = Math.max(0, N_PREV_WEEKS - current.length)
  if (needed === 0) return current
  const prevSlice: MergedRow[] = prev.slice(-needed).map((r) => ({ ...r, isPrev: true }))
  return [...prevSlice, ...current]
})

// Exclude weeks with no data (first week of a season has no previous week to compare against)
const validMerged = computed(() => mergedResults.value.filter((r) => r.total_players > 0))

const lastWeeks = computed(() => validMerged.value.slice(-7))

const latestRate = computed(() => {
  const last = validMerged.value[validMerged.value.length - 1]
  return last ? pct(last) : 0
})
const prevRate = computed(() => {
  const prev = validMerged.value[validMerged.value.length - 2]
  return prev ? pct(prev) : null
})

function pct(r: { retained_players: number; total_players: number }): number {
  if (r.total_players === 0) return 0
  return Math.round((r.retained_players / r.total_players) * 100)
}

function rateClass(rate: number): string {
  if (rate >= 70) return 'rate-good'
  if (rate >= 50) return 'rate-mid'
  return 'rate-bad'
}

const trendLabel = computed(() => {
  if (prevRate.value === null) return ''
  const diff = latestRate.value - prevRate.value
  return diff > 0 ? `+${diff}pp` : `${diff}pp`
})
const trendClass = computed(() => {
  if (prevRate.value === null) return ''
  return latestRate.value >= prevRate.value ? 'text-success' : 'text-danger'
})

function formatDate(ts: number): string {
  const d = new Date(ts * 1000)
  return d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })
}
</script>

<style scoped>
.kpi-number {
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1;
}
.kpi-label {
  font-size: 0.78rem;
}
.kpi-trend {
  font-size: 0.85rem;
  font-weight: 600;
}
.retention-table {
  border-collapse: collapse;
  font-size: 0.78rem;
}
.retention-table tr {
  border-bottom: 1px solid var(--bs-border-color);
}
.retention-table tr:last-child {
  border-bottom: none;
}
.ret-date {
  padding: 3px 6px 3px 2px;
  white-space: nowrap;
}
.ret-counts {
  padding: 3px 6px;
  font-size: 0.72rem;
}
.ret-rate {
  padding: 3px 2px 3px 6px;
  white-space: nowrap;
}
.badge-rate {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 1px 5px;
  border-radius: 4px;
}
.rate-good {
  color: var(--bs-success);
}
.rate-mid {
  color: var(--bs-warning);
}
.rate-bad {
  color: var(--bs-danger);
}
.prev-season-row {
  color: var(--bs-secondary-color);
}
</style>
