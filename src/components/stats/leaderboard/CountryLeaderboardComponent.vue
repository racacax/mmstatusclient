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
      <div class="d-flex flex-column gap-2" v-if="!countriesLoading && countries !== null">
        Country:
        <select
          class="form-select form-select-sm"
          @change="
            (e) => {
              metricValueRef = getEventValue(e)
            }
          "
        >
          <option
            v-for="o in countries.results"
            :value="o.country_alpha3"
            :key="o.country_alpha3"
            :selected="o.country_alpha3 === metricValueRef"
          >
            {{ o.name }}
          </option>
        </select>
      </div>
    </template>
  </TableComponent>
</template>

<script setup lang="ts">
import { ref, type Ref, watch } from 'vue'
import { APIClient } from '@/api/client'
import { getEventValue, getRenderedRank } from '@/utils'
import TableComponent from '@/components/basic/TableComponent.vue'

const props = defineProps({
  season: { type: Number, required: true }
})

const data: Ref<any[] | null> = ref(null)
const page = ref(1)
const seasonRef = ref(props.season)
const metricRef = ref('country')
const metricValueRef = ref('FRA')
const lastUpdated: Ref<string | null> = ref(null)

const columns = ref([' ', 'Player', 'Global rank', 'Rank', 'Points'])

function callback(_: string, __: string, p: number) {
  page.value = p
}

const { data: countries, loading: countriesLoading } = APIClient.getCountries()
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
    fetchStats()
  }
)
watch([metricValueRef], () => {
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
        currentData.push([
          (page.value - 1) * 10 + (i + 1),
          `
            <a target="_blank" href="/#/statistics/${e.uuid}">${e.name}</a>
            `,
          e.rank,
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
