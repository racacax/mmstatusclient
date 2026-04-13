<template>
  <TableComponent
    tooltip="These stats are season global"
    title="Leaderboard by country"
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
        :model-value="metricValueRef"
        @update:model-value="metricValueRef = $event"
      />
    </template>
  </TableComponent>
</template>

<script setup lang="ts">
import { ref, computed, type Ref, watch } from 'vue'
import { APIClient } from '@/api/client'
import { getRenderedRank, ordinalSuffixOf, renderMPStyle } from '@/utils'
import TableComponent from '@/components/basic/TableComponent.vue'
import getCountryISO2 from 'country-iso-3-to-2'
import { countryCodeEmoji } from 'country-code-emoji'
import SelectInputComponent from '@/components/basic/SelectInputComponent.vue'

const props = defineProps({
  season: { type: Number, required: true }
})

const data: Ref<any[] | null> = ref(null)
const page = ref(1)
const seasonRef = ref(props.season)
const metricRef = ref('country')
const metricValueRef = ref('FRA')
const lastUpdated: Ref<string | null> = ref(null)

const columns = ref([' ', 'Player', 'Global position', 'Rank', 'Points'])

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
} = APIClient.getLeaderboard(metricRef, metricValueRef, seasonRef, { lazy: true })
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
watch([metricValueRef, seasonRef], () => {
  page.value = 1
  fetchStats()
})
watch([page], formatData)

function formatData() {
  let currentData: any[] = []
  if (stats.value !== null && stats.value !== undefined) {
    lastUpdated.value = `Last updated on : ${new Date(stats.value?.last_updated * 1000).toLocaleString()}`
    stats.value.results
      .filter((el, i) => i >= (page.value - 1) * 10 && i < page.value * 10)
      .forEach((e, i) => {
        const regionFlag = e.region
          ? `<img alt="" title="${e.region.name}" class="player-flag" src="/flags/${e.region.file_name}" />`
          : ''
        const clubTag = e.club_tag ? `[<span>${renderMPStyle(e.club_tag)}</span>]&nbsp;` : ''
        currentData.push([
          (page.value - 1) * 10 + (i + 1),
          `${regionFlag}${clubTag}<a target="_blank" href="/#/player-statistics/${e.uuid}">${e.name}</a>`,
          ordinalSuffixOf(e.rank),
          getRenderedRank(e.points, e.rank, '30px'),
          e.points
        ])
      })
    data.value = currentData
    return
  }
  data.value = null
}
</script>

<style scoped></style>
