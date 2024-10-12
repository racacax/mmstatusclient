<template>
  <TableComponent
    tooltip="Top 1000 of the season are awarded points depending on their ranks. Points repartition depends on a log 2 scale."
    title="Countries leaderboard"
    classes="col-12 col-lg-6"
    :display-page="true"
    :callback="callback"
    :data="data"
    :columns="columns"
    :page-number="page"
    :error="error"
    :bottom-label="lastUpdated ?? undefined"
  >
  </TableComponent>
</template>

<script setup lang="ts">
import { ref, type Ref, watch } from 'vue'
import { APIClient } from '@/api/client'
import TableComponent from '@/components/basic/TableComponent.vue'
import getCountryISO2 from 'country-iso-3-to-2'
import { countryCodeEmoji } from 'country-code-emoji'

const props = defineProps({
  season: { type: Number, required: true }
})

const data: Ref<any[] | null> = ref(null)
const page = ref(1)
const seasonRef = ref(props.season)
const lastUpdated: Ref<string | null> = ref(null)

const columns = ref([' ', 'Country', 'Points'])

function callback(_: string, __: string, p: number) {
  page.value = p
}
const { data: stats, error, fetchFn } = APIClient.getCountriesLeaderboard(seasonRef, { lazy: true })
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
watch([seasonRef], fetchStats)
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
          `${countryCodeEmoji(getCountryISO2(e.country_alpha3))} ${e.name}`,
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
