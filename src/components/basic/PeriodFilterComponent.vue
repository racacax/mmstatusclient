<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { APIClient } from '@/api/client'
import { getLocalDate, getEventValue, formatSeasonName } from '@/utils'
import type { SeasonResult } from '@/api/entities'
import DropdownComponent from '@/components/basic/DropdownComponent.vue'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
const props = withDefaults(
  defineProps<{
    allowTimeRange?: boolean
    initialSeasonId?: number
    initialMinDate?: Date
    initialMaxDate?: Date
  }>(),
  { allowTimeRange: true }
)

const mode = ref<'season' | 'timerange'>('season')

const { data: seasonsData } = APIClient.getSeasons()
const seasons = computed(() => seasonsData.value?.results ?? [])

const seasonOptions = computed(() =>
  [...seasons.value].reverse().map((s) => ({
    value: s.id,
    label: formatSeasonName(s.name),
    detail: `${new Date(s.start_time * 1000).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })} → ${new Date(s.end_time * 1000).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}`
  }))
)

const selectedSeasonId = ref<number | null>(null)
const season = ref<number | null>(null)
const seasonResult = computed(() => seasons.value.find((s) => s.id === season.value) ?? null)
const minDate = ref<Date>(new Date())
const maxDate = ref<Date>(new Date())

function applySeasonBoundaries(s: SeasonResult) {
  minDate.value = new Date(s.start_time * 1000)
  maxDate.value = new Date(s.end_time * 1000)
}

watch(
  seasons,
  (list) => {
    if (list.length === 0 || selectedSeasonId.value !== null) return
    if (
      props.allowTimeRange &&
      !props.initialSeasonId &&
      props.initialMinDate &&
      props.initialMaxDate
    ) {
      mode.value = 'timerange'
      season.value = null
      minDate.value = props.initialMinDate
      maxDate.value = props.initialMaxDate
      return
    }
    const now = Date.now() / 1000
    const picked =
      (props.initialSeasonId ? list.find((s) => s.id === props.initialSeasonId) : null) ??
      list.find((s) => s.start_time <= now && s.end_time >= now) ??
      list[list.length - 1]
    selectedSeasonId.value = picked.id
    season.value = picked.id
    applySeasonBoundaries(picked)
  },
  { immediate: true }
)

watch(selectedSeasonId, (id) => {
  if (mode.value !== 'season' || id === null) return
  const s = seasons.value.find((s) => s.id === id)
  if (!s) return
  season.value = s.id
  applySeasonBoundaries(s)
})

function switchToSeason() {
  mode.value = 'season'
  const s = seasons.value.find((s) => s.id === selectedSeasonId.value)
  if (!s) return
  season.value = s.id
  applySeasonBoundaries(s)
}

function switchToTimeRange() {
  mode.value = 'timerange'
  season.value = null
}

function onMinDateChange(e: Event) {
  const val = getEventValue(e)
  if (val) minDate.value = new Date(val)
}

function onMaxDateChange(e: Event) {
  const val = getEventValue(e)
  if (val) maxDate.value = new Date(val)
}

const ready = computed(() => seasons.value.length > 0)
defineExpose({ season, seasonResult, minDate, maxDate, ready })
</script>

<template>
  <div class="d-flex align-items-stretch gap-2 flex-wrap min-content text-nowrap">
    <div class="d-flex gap-2 justify-content-between w-100">
      <label class="form-label fw-semibold w-100 mb-0" v-if="allowTimeRange">Filter By</label>
      <label class="form-label fw-semibold w-100 mb-0" v-else>Season</label>
      <div v-if="allowTimeRange">
        <div class="btn-group btn-group-sm d-flex" role="group">
          <button
            type="button"
            class="btn"
            :class="mode === 'season' ? 'btn-primary' : 'btn-outline-primary'"
            @click="switchToSeason"
          >
            Season
          </button>
          <button
            type="button"
            class="btn"
            :class="mode === 'timerange' ? 'btn-primary' : 'btn-outline-primary'"
            @click="switchToTimeRange"
          >
            Time range
          </button>
        </div>
      </div>
    </div>
    <div class="d-flex align-items-stretch">
      <Transition name="period-filter" mode="out-in">
        <div v-if="mode === 'season'" class="d-flex h-100 align-items-end">
          <DropdownComponent :options="seasonOptions" v-model="selectedSeasonId" />
        </div>
        <div
          v-else
          class="d-flex gap-2 align-items-center flex-wrap flex-lg-nowrap justify-content-center"
        >
          <input
            type="datetime-local"
            class="filter-input"
            style="min-width: 180px"
            :value="getLocalDate(minDate)"
            @blur="onMinDateChange"
            @keyup.enter="onMinDateChange"
          />
          <FontAwesomeIcon :icon="faArrowRight" />
          <input
            type="datetime-local"
            class="filter-input"
            style="min-width: 180px"
            :value="getLocalDate(maxDate)"
            @blur="onMaxDateChange"
            @keyup.enter="onMaxDateChange"
          />
        </div>
      </Transition>
    </div>
  </div>
</template>

<style>
.period-filter-dates {
  align-self: center;
  white-space: nowrap;
}
.period-filter-enter-active,
.period-filter-leave-active {
  transition: opacity 0.15s ease;
}
.period-filter-enter-from,
.period-filter-leave-to {
  opacity: 0;
}
</style>
