<template>
  <CardComponent
    classes="col-lg-6 col-12"
    title="Players by country"
    tooltip="These stats are season global."
  >
    <template #filters>
      <RankFilterComponent v-model="currentMinRank" label="Min. rank" :top10="true" />
    </template>
    <template #main>
      <ErrorManager :error="error">
        <template #body>
          <LoadingComponent v-if="loading || data === null" />
          <template v-else>
            <div v-if="data.results.length === 0" class="w-100 d-flex justify-content-center">
              <span>No data to display</span>
            </div>
            <MapChartComponent
              v-else
              label="Players"
              :data="
                data.results.map((e) => [
                  getCountryISO2(e.country_alpha3)?.toLowerCase() ?? 'Other',
                  e.total
                ])
              "
            />
            <div class="w-100 d-flex justify-content-end">
              <i>Last updated at: {{ new Date(data.last_updated * 1000).toLocaleString() }}</i>
            </div>
          </template></template
        ></ErrorManager
      >
    </template>
  </CardComponent>
</template>

<script setup lang="ts">
import LoadingComponent from '@/components/basic/LoadingComponent.vue'
import getCountryISO2 from 'country-iso-3-to-2'
import { ref, watch } from 'vue'
import MapChartComponent from '@/components/charts/MapChartComponent.vue'
import { APIClient } from '@/api/client'
import CardComponent from '@/components/basic/CardComponent.vue'
import ErrorManager from '@/components/management/ErrorManager.vue'
import RankFilterComponent from '@/components/basic/RankFilterComponent.vue'

const props = defineProps({
  season: { type: Number, required: true }
})

const currentMinRank = ref(0)
const seasonRef = ref(props.season)
const { data, error, loading } = APIClient.getPlayersPerCountry(seasonRef, currentMinRank)
watch(
  () => props.season,
  () => (seasonRef.value = props.season)
)
</script>
