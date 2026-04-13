<template>
  <TableComponent
    tooltip="Most active players this week ranked by wins. Only available for Master I+ games (3000+ elo)."
    title="Hot this week (Wins)"
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
import { ref, type Ref, watch } from 'vue'
import { APIClient } from '@/api/client'
import { renderMPStyle as MPStyle } from '@/utils'
import TableComponent from '@/components/basic/TableComponent.vue'
import RankFilterComponent from '@/components/basic/RankFilterComponent.vue'

const props = defineProps({
  season: { type: Number, required: true }
})

const data: Ref<any[] | null> = ref(null)
const page = ref(1)
const seasonRef = ref(props.season)
const minEloRef = ref(3000)
const lastUpdated: Ref<string | null> = ref(null)

const columns = ref([' ', 'Player', 'Wins', 'Played', 'Win-rate'])

function callback(_: string, __: string, p: number) {
  page.value = p
}

const {
  data: stats,
  error,
  fetchFn
} = APIClient.getHotThisWeek(seasonRef, minEloRef, { lazy: true })

function fetchStats() {
  data.value = null
  fetchFn().then(() => formatData())
}
fetchStats()

watch(
  () => [props.season],
  () => {
    seasonRef.value = props.season
  }
)
watch([seasonRef, minEloRef], () => {
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
      (page.value - 1) * 10 + (i + 1),
      `<img alt="" title="${e.country.name}" class="player-flag" src="/flags/${e.country.file_name}" />${e.club_tag ? ` [<span>${MPStyle(e.club_tag)}</span>]&nbsp;` : ''}<a href="/#/player-statistics/${e.uuid}">${e.name}</a>`,
      e.wins,
      e.played,
      `${((e.wins / e.played) * 100).toFixed(1)}%`
    ])
}
</script>

<style scoped></style>
