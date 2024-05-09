<template>
  <CardComponent
    classes="col-lg-6 col-12"
    title="Rank distribution evolution"
    tooltip="Season global statistics. Only counts active players for the selected season."
  >
    <template #main>
      <div class="w-100 position-relative">
        <div class="w-100" :class="{ 'opacity-0': data === null }">
          <StackedBarChartComponent
            label="Players"
            :enable-legend="true"
            :data="
              ranks.map((rank) => ({
                name: rank.name,
                data: data?.results?.map((result) => [result.date * 1000, result[rank.key]])
              })) ?? []
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
import { ref, type Ref, watch } from 'vue'
import { APIClient } from '@/api/client'
import { type RankDistributionEvolution } from '@/api/entities'
import CardComponent from '@/components/basic/CardComponent.vue'
import StackedBarChartComponent from '@/components/charts/StackedBarChartComponent.vue'
import { ranks } from '@/constants'

const props = defineProps({
  season: { type: Number, required: true }
})

const data: Ref<RankDistributionEvolution | null> = ref(null)
function fetchStats() {
  data.value = null
  APIClient.getRankDistributionEvolution(props.season).then((j) => {
    data.value = j
  })
}
fetchStats()
watch(() => props.season, fetchStats)
</script>
