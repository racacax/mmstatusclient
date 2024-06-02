<template>
  <CardComponent
    classes="col-lg-6 col-12"
    title="Player matches by country"
    tooltip="These stats are season global. Matches aren't unique. It will be shown in every nation that participated. Also, if two players of the same nation are in the same match, the match will be counted two times."
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
              <MapChartComponent
                label="Player matches"
                :data="
                  data?.results?.map((e) => [
                    getCountryISO2(e.country_alpha3)?.toLowerCase() ?? 'Other',
                    e.total
                  ]) ?? []
                "
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

<script setup lang="ts">
import LoadingComponent from '@/components/basic/LoadingComponent.vue'
import getCountryISO2 from 'country-iso-3-to-2'
import { ref, watch } from 'vue'
import { getEventValue } from '@/utils'
import { ranks } from '@/constants'
import MapChartComponent from '@/components/charts/MapChartComponent.vue'
import { APIClient } from '@/api/client'
import CardComponent from '@/components/basic/CardComponent.vue'
import ErrorManager from '@/components/management/ErrorManager.vue'

const props = defineProps({
  season: { type: Number, required: true }
})

const currentMinRank = ref(0)
const seasonRef = ref(props.season)
const { data, error, loading } = APIClient.getActivityPerCountry(seasonRef, currentMinRank)
watch(
  () => props.season,
  () => (seasonRef.value = props.season)
)
</script>
