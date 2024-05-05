<template>
  <CardComponent
    classes="col-lg-6 col-12"
    title="Players by country"
    tooltip="These stats are season global."
  >
    <template #filters>
      <div>
        Min. rank:<br />
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
      <div class="w-100 position-relative">
        <div class="w-100" :class="{ 'opacity-0': data === null }">
          <MapChartComponent
            label="Players"
            :data="
              data?.results?.map((e) => [
                getCountryISO2(e.country_alpha3)?.toLowerCase() ?? 'Other',
                e.total
              ]) ?? []
            "
          />
        </div>
        <div class="w-100 position-absolute top-0 left-0">
          <LoadingComponent v-if="data === null" />
        </div>
        <div class="w-100 d-flex justify-content-center" v-if="data?.results?.length === 0">
          <span>No data to display</span>
        </div>
        <div class="w-100 d-flex justify-content-end">
          <i>Last updated at: {{ new Date((data?.last_updated ?? 0) * 1000).toLocaleString() }}</i>
        </div>
      </div>
    </template>
  </CardComponent>
</template>

<script setup lang="ts">
import LoadingComponent from '@/components/LoadingComponent.vue'
import getCountryISO2 from 'country-iso-3-to-2'
import { ref, type Ref, watch } from 'vue'
import { getEventValue } from '@/utils'
import { ranks } from '@/constants'
import MapChartComponent from '@/components/charts/MapChartComponent.vue'
import { APIClient } from '@/api/client'
import { type CountryStats } from '@/api/entities'
import CardComponent from '@/components/basic/CardComponent.vue'

const props = defineProps({
  season: { type: Number, required: true }
})

const currentMinRank = ref(0)
const data: Ref<CountryStats | null> = ref(null)
function fetchStats() {
  data.value = null
  APIClient.getPlayersPerCountry(props.season, currentMinRank.value).then((j) => {
    data.value = j
  })
}
fetchStats()
watch(() => props.season, fetchStats)
watch(currentMinRank, fetchStats)
</script>
