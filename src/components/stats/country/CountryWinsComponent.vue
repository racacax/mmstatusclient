<template>
  <CardComponent
    classes="col-lg-6 col-12 country-wins-losses"
    title="Wins/losses by country"
    tooltip="These stats are season global. Shows every player of each match where one player has the minimum rank selected. Players are not unique. If a player played 10 matches in one hour, they will be displayed 10 times."
  >
    <template #filters>
      <div>
        Min. match rank:<br />
        <select
          class="form-select form-select-sm"
          @change="
            (e) => {
              currentMinRank = getEventValue(e)
            }
          "
        >
          <option v-for="o in [...ranks].reverse()" :value="o.minElo" :key="o.name">
            {{ o.name }}
          </option>
        </select>
      </div>
    </template>
    <template #main>
      <ErrorManager :error="error">
        <template #body>
          <div class="w-100 position-relative">
            <div class="w-100" :class="{ 'opacity-0': data === null }">
              <StackedBarChartComponent
                label="Player matches"
                :categories="sortedCountries.map((country) => country.name) ?? []"
                :data="[
                  {
                    name: 'Wins',
                    data: sortedCountries.map((country) => parseInt(country.wins)) ?? []
                  },
                  {
                    name: 'Losses',
                    data:
                      sortedCountries.map((country) => country.total - parseInt(country.wins)) ?? []
                  }
                ]"
              />
            </div>
            <div class="w-100 position-absolute top-0 left-0">
              <LoadingComponent v-if="loading || data === null" />
            </div>
            <div class="w-100 d-flex justify-content-center" v-if="data?.results?.length === 0">
              <span>No data to display</span>
            </div>
            <div class="w-100 d-flex justify-content-end">
              <i
                >Last updated at:
                {{ new Date((data?.last_updated ?? 0) * 1000).toLocaleString() }}</i
              >
            </div>
          </div>
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
import { getEventValue } from '@/utils'
import { ranks } from '@/constants'
import { APIClient } from '@/api/client'
import { type CountryStatsResult } from '@/api/entities'
import CardComponent from '@/components/basic/CardComponent.vue'
import StackedBarChartComponent from '@/components/charts/StackedBarChartComponent.vue'
import ErrorManager from '@/components/management/ErrorManager.vue'

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
