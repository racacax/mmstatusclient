<template>
  <CardComponent
    classes="col-12 col-lg-6"
    title="Map rank distribution"
    tooltip="Number of times each rank played on a given map for the selected season."
  >
    <template #filters>
      <SelectInputComponent
        label="Map"
        :options="mapOptions"
        :model-value="selectedMapUid"
        @update:model-value="selectedMapUid = $event"
      />
    </template>
    <template #main>
      <ErrorManager :error="error || errorMaps">
        <template #body>
          <LoadingComponent v-if="loadingMaps || loading || data === null" />
          <template v-else>
            <div
              v-if="selectedMapUid && data.results.length === 0"
              class="w-100 d-flex justify-content-center"
            >
              <span>No data to display</span>
            </div>
            <highcharts v-else class="hc" :options="chartOptions" />
            <div class="w-100 d-flex justify-content-end">
              <i>Last updated at: {{ new Date(data.last_updated * 1000).toLocaleString() }}</i>
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
import SelectInputComponent from '@/components/basic/SelectInputComponent.vue'

const props = defineProps({
  season: { type: Number, required: true }
})

const seasonRef = ref(props.season)
watch(
  () => props.season,
  () => (seasonRef.value = props.season)
)

const {
  data: mapsData,
  error: errorMaps,
  loading: loadingMaps
} = APIClient.getMapsStatistics(seasonRef)

const mapOptions = computed(() =>
  (mapsData.value?.results.map((m) => ({ value: m.map_uid, label: m.map_name })) ?? []).sort(
    (a, b) => a.label.localeCompare(b.label)
  )
)

const selectedMapUid = ref<string | null>(null)
watch(mapOptions, (opts) => {
  if (selectedMapUid.value === null && opts.length > 0) {
    selectedMapUid.value = opts[0].value
  }
})

const {
  data,
  error,
  loading,
  fetchFn: fetchDistribution
} = APIClient.getMapRankDistribution(seasonRef, selectedMapUid, { lazy: true })
watch(selectedMapUid, (uid) => {
  if (uid !== null) fetchDistribution()
})
watch(seasonRef, () => {
  if (selectedMapUid.value !== null) fetchDistribution()
})

const chartOptions = computed(() => {
  const results = data.value?.results ?? []
  return {
    chart: { type: 'bar', styledMode: true },
    title: { text: '' },
    xAxis: {
      categories: results.map((r) => r.name),
      title: { text: '' }
    },
    yAxis: {
      min: 0,
      title: { text: 'Times played' }
    },
    tooltip: {
      headerFormat: '<b>{point.key}</b><br/>',
      pointFormat: 'Times played: <b>{point.y}</b>'
    },
    legend: { enabled: false },
    plotOptions: {
      bar: { borderWidth: 0, pointPadding: 0.1 }
    },
    series: [
      {
        name: 'Times played',
        data: results.map((r) => r.count)
      }
    ]
  }
})
</script>
