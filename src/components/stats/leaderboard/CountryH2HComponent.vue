<template>
  <TableComponent
    tooltip="Win/loss records for a given country against all others. Only available for Master I+ games (3000+ elo).
Note: If country is present in both teams, it will be a draw."
    title="Country Head-to-Head"
    classes="col-12 col-lg-6"
    :display-page="true"
    :callback="callback"
    :data="data"
    :columns="columns"
    :page-number="page"
    :error="error"
    :bottom-label="lastUpdated ?? undefined"
  >
    <template #custom-filters>
      <SelectInputComponent
        v-if="!countriesLoading && countries !== null"
        label="Country"
        :options="countryOptions"
        :model-value="countryRef"
        @update:model-value="countryRef = $event"
      />
      <RankFilterComponent
        v-model="minEloRef"
        :top10="true"
        :min-filter-elo="3000"
        label="Min. Rank"
      />
    </template>
  </TableComponent>
</template>

<script setup lang="ts">
import { ref, computed, type Ref, watch } from 'vue'
import { APIClient } from '@/api/client'
import TableComponent from '@/components/basic/TableComponent.vue'
import getCountryISO2 from 'country-iso-3-to-2'
import { countryCodeEmoji } from 'country-code-emoji'
import RankFilterComponent from '@/components/basic/RankFilterComponent.vue'
import SelectInputComponent from '@/components/basic/SelectInputComponent.vue'

const props = defineProps({
  season: { type: Number, required: true }
})

const data: Ref<any[] | null> = ref(null)
const page = ref(1)
const seasonRef = ref(props.season)
const countryRef = ref('FRA')
const minEloRef = ref(3000)
const lastUpdated: Ref<string | null> = ref(null)

const columns = ref(['Opponent', 'Wins', 'Losses', 'Draws', 'Matches', 'Win-rate'])

function callback(_: string, __: string, p: number) {
  page.value = p
}

const { data: countries, loading: countriesLoading } = APIClient.getCountries()

const countryOptions = computed(
  () =>
    countries.value?.results.map((o) => ({
      value: o.country_alpha3,
      label: `${countryCodeEmoji(getCountryISO2(o.country_alpha3))} ${o.name}`
    })) ?? []
)

const {
  data: stats,
  error,
  fetchFn
} = APIClient.getCountryH2H(seasonRef, countryRef, minEloRef, { lazy: true })

function fetchStats() {
  data.value = null
  fetchFn().then(() => {
    formatData()
  })
}
fetchStats()

watch(
  () => [props.season],
  () => {
    seasonRef.value = props.season
  }
)
watch([seasonRef, countryRef, minEloRef], () => {
  page.value = 1
  fetchStats()
})
watch([page], formatData)

function formatData() {
  if (stats.value === null || stats.value === undefined) {
    data.value = null
    return
  }
  lastUpdated.value = `Last updated on : ${new Date(stats.value.last_updated * 1000).toLocaleString()}`
  data.value = stats.value.results
    .filter((_, i) => i >= (page.value - 1) * 10 && i < page.value * 10)
    .map((e, i) => [
      `<img alt="" title="${e.opponent.name}" class="player-flag" src="/flags/${e.opponent.file_name}" /> ${e.opponent.name}`,
      e.wins,
      e.losses,
      e.draws,
      e.games,
      `${((e.wins / e.games) * 100).toFixed(1)}% (${((e.wins / (e.wins + e.losses)) * 100).toFixed(1)}%)`
    ])
}
</script>

<style scoped></style>
