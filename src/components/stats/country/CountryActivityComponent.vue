<template>
  <CardComponent
    classes="col-lg-6 col-12 country-activity"
    title="Cumulated players per hour"
    tooltip="Timezone: Europe/Paris. These stats are season global. Shows every player of each match where one player has the minimum rank selected. Players are not unique. If a player played 10 matches in one hour, they will be displayed 10 times."
  >
    <template #filters>
      <RankFilterComponent v-model="currentMinRank" label="Min. match rank" :top10="true" />
    </template>
    <template #main>
      <ErrorManager :error="error">
        <template #body>
          <LoadingComponent v-if="loading || data === null" />
          <template v-else>
            <div v-if="data.results.length === 0" class="w-100 d-flex justify-content-center">
              <span>No data to display</span>
            </div>
            <StackedBarChartComponent
              v-else
              label="Player matches"
              :categories="Array.from({ length: 24 }, (_, i) => `${i}h`)"
              :data="
                data.results.map((country) => ({
                  name: country.name,
                  data: Array.from({ length: 24 }, (_, i) =>
                    parseInt(country[`${i}-${i + 1}` as keyof CountryAndHourResult] as string)
                  )
                }))
              "
            />
            <div class="w-100 d-flex justify-content-end">
              <i>Last updated at: {{ new Date(data.last_updated * 1000).toLocaleString() }}</i>
            </div>
          </template>
        </template>
      </ErrorManager>
    </template>
  </CardComponent>
</template>

<style>
.country-activity .highcharts-navigator-xaxis {
  display: none;
}
</style>
<script setup lang="ts">
import LoadingComponent from '@/components/basic/LoadingComponent.vue'
import { ref, watch } from 'vue'
import { APIClient } from '@/api/client'
import CardComponent from '@/components/basic/CardComponent.vue'
import StackedBarChartComponent from '@/components/charts/StackedBarChartComponent.vue'
import ErrorManager from '@/components/management/ErrorManager.vue'
import type { CountryAndHourResult } from '@/api/entities'
import RankFilterComponent from '@/components/basic/RankFilterComponent.vue'

const props = defineProps({
  season: { type: Number, required: true }
})

const currentMinRank = ref(0)

const seasonRef = ref(props.season)
const { data, error, loading } = APIClient.getActivityPerCountryAndHour(seasonRef, currentMinRank)
watch(
  () => props.season,
  () => (seasonRef.value = props.season)
)
</script>
