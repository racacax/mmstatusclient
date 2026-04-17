<template>
  <CardComponent
    classes="col-12 col-lg-6"
    title="New players per week"
    tooltip="Number of players who played their first game each week for the selected season and minimum rank."
  >
    <template #filters>
      <RankFilterComponent v-model="minEloRef" :top10="true" label="Min. Rank" />
    </template>
    <template #main>
      <ErrorManager :error="error">
        <template #body>
          <LoadingComponent v-if="loading || data === null" />
          <template v-else>
            <div v-if="data.results.length === 0" class="w-100 d-flex justify-content-center">
              <span>No data to display</span>
            </div>
            <ColumnChartComponent v-else label="New players" :data="chartData" />
            <div class="w-100 d-flex justify-content-end">
              <i>Last updated on : {{ new Date(data.last_updated * 1000).toLocaleString() }}</i>
            </div>
          </template>
        </template>
      </ErrorManager>
    </template>
  </CardComponent>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { APIClient } from '@/api/client'
import CardComponent from '@/components/basic/CardComponent.vue'
import LoadingComponent from '@/components/basic/LoadingComponent.vue'
import ErrorManager from '@/components/management/ErrorManager.vue'
import ColumnChartComponent from '@/components/charts/ColumnChartComponent.vue'
import RankFilterComponent from '@/components/basic/RankFilterComponent.vue'

const props = defineProps({
  season: { type: Number, required: true }
})

const seasonRef = ref(props.season)
const minEloRef = ref(0)

watch(
  () => props.season,
  () => (seasonRef.value = props.season)
)

const { data, error, loading } = APIClient.getNewPlayersPerWeek(seasonRef, minEloRef)

const chartData = computed(
  () => data.value?.results.map((r) => [r.week_start * 1000, r.new_players]) ?? []
)
</script>
