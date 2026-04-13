<template>
  <TableComponent
    tooltip="Leaderboard across all players for the selected season."
    title="Leaderboard"
    classes="col-12 col-lg-6"
    :display-page="true"
    :callback="callback"
    :data="data"
    :columns="columns"
    :page-number="page"
    :error="error"
  >
  </TableComponent>
</template>

<script setup lang="ts">
import { ref, type Ref, watch } from 'vue'
import { APIClient } from '@/api/client'
import { getRenderedRank, renderMPStyle } from '@/utils'
import TableComponent from '@/components/basic/TableComponent.vue'

const props = defineProps({
  season: { type: Number, required: true }
})

const data: Ref<any[] | null> = ref(null)
const page = ref(1)
const limit = ref(10)
const seasonRef = ref(props.season)

const columns = ref([' ', 'Player', 'Rank', 'Points'])

function callback(_: string, __: string, p: number) {
  page.value = p
}

watch(
  () => [props.season],
  () => {
    seasonRef.value = props.season
    page.value = 1
  }
)

const { data: stats, error } = APIClient.getGlobalLeaderboard(seasonRef, page, limit)

watch(stats, formatData)

function formatData() {
  if (stats.value === null || stats.value === undefined) {
    data.value = null
    return
  }
  data.value = stats.value.results.map((e, i) => {
    const clubTag = e.club_tag ? `[<span>${renderMPStyle(e.club_tag)}</span>]&nbsp;` : ''
    return [
      (stats.value!.page - 1) * stats.value!.limit + (i + 1),
      `<img alt="" title="${e.country.name}" class="player-flag" src="/flags/${e.country.file_name}" />${clubTag}<a target="_blank" href="/#/player-statistics/${e.uuid}">${e.name}</a>`,
      getRenderedRank(e.points, e.rank, '30px'),
      e.points
    ]
  })
}
</script>

<style scoped></style>
