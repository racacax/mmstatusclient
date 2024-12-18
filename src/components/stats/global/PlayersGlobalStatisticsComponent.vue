<template>
  <ErrorManager :error="error">
    <template #body>
      <TableComponent
        tooltip="These stats are season global"
        title="Players"
        classes="col-12 col-lg-6"
        :display-page="true"
        :callback="callback"
        :data="data"
        :order-by="orderByList"
        :columns="columns"
        :bottom-label="lastUpdated ?? undefined"
      />
    </template>
  </ErrorManager>
</template>

<script setup lang="ts">
import { ref, type Ref, watch } from 'vue'
import { APIClient } from '@/api/client'
import TableComponent from '@/components/basic/TableComponent.vue'
import ErrorManager from '@/components/management/ErrorManager.vue'

const props = defineProps({
  season: { type: Number, required: true }
})

const data: Ref<any[] | null> = ref(null)
const lastUpdated: Ref<string | null> = ref(null)
const page = ref(1)
const orderBy: Ref<string> = ref('played')
const orderByList = ref([
  { value: 'played', label: 'Played' },
  { value: 'wins', label: 'Wins' },
  { value: 'losses', label: 'Losses' },
  { value: 'mvps', label: 'MVPs' }
])

const columns = ref(['Player', 'Matches played', 'Wins', 'Losses', 'MVPs'])

function callback(order: string, oBy: string, p: number) {
  orderBy.value = oBy
  page.value = p
}

const seasonRef = ref(props.season)
const { data: stats, error } = APIClient.getPlayersStatistics(seasonRef, orderBy)

watch(
  () => [props.season],
  () => {
    seasonRef.value = props.season
  }
)

watch([page], formatData)
watch(stats, formatData)

function formatData() {
  let currentData: any[] = []
  if (stats.value !== null) {
    lastUpdated.value = `Last updated on : ${new Date(stats.value?.last_updated * 1000).toLocaleString()}`
    stats.value.results
      .filter((el, i) => i >= (page.value - 1) * 10 && i < page.value * 10)
      .forEach((e) => {
        currentData.push([
          `
          <a target="_blank" href="/#/statistics/${e.uuid}">${e.name}</a>
          `,
          e.played,
          e.wins.toString().replace(' ', '&nbsp;') +
            ' (' +
            Math.round((e.wins * 100) / e.played).toString() +
            '&nbsp;%)',
          e.losses.toString().replace(' ', '&nbsp;') +
            ' (' +
            Math.round((e.losses * 100) / e.played).toString() +
            '&nbsp;%)',
          e.mvps.toString().replace(' ', '&nbsp;') +
            ' (' +
            Math.round((e.mvps * 100) / e.played).toString() +
            '&nbsp;%)'
        ])
      })
    data.value = currentData
    return
  }
  data.value = null
}
</script>

<style scoped></style>
