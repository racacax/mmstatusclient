<template>
  <CardComponent
    classes="col-lg-6 col-12 country-wins-losses"
    title="Wins/losses by country"
    tooltip="These stats are season global. Shows every player of each match where one player has the minimum rank selected. Players are not unique. If a player played 10 matches in one hour, they will be displayed 10 times."
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
              :categories="sortedCountries.map((country) => country.name)"
              :data="[
                { name: 'Wins', data: sortedCountries.map((country) => parseInt(country.wins)) },
                {
                  name: 'Losses',
                  data: sortedCountries.map((country) => country.total - parseInt(country.wins))
                }
              ]"
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
.country-wins-losses .highcharts-navigator-xaxis {
  display: none;
}
</style>
<script setup lang="ts">
import LoadingComponent from '@/components/basic/LoadingComponent.vue'
import { ref, watch } from 'vue'
import { APIClient } from '@/api/client'
import { type CountryStatsResult } from '@/api/entities'
import CardComponent from '@/components/basic/CardComponent.vue'
import StackedBarChartComponent from '@/components/charts/StackedBarChartComponent.vue'
import ErrorManager from '@/components/management/ErrorManager.vue'
import RankFilterComponent from '@/components/basic/RankFilterComponent.vue'

const props = defineProps({
  season: { type: Number, required: true }
})

const currentMinRank = ref(0)

const sortedCountries = ref<CountryStatsResult[]>([])
const seasonRef = ref(props.season)
const { data, error, loading } = APIClient.getActivityPerCountry(seasonRef, currentMinRank)
watch(
  () => props.season,
  () => (seasonRef.value = props.season)
)

watch(
  data,
  () =>
    (sortedCountries.value =
      data.value?.results?.sort((a, b) => (a.total > b.total ? -1 : 1)) ?? [])
)
</script>
