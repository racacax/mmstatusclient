<template>
  <CardComponent
    classes="col-lg-6 col-12"
    title="Player rank evolution"
    tooltip="Note: Before April 28th, data are not available."
  >
    <template #filters>
      <div style="height: 40px"></div>
    </template>
    <template #main>
      <ErrorManager :error="error">
        <template #body>
          <div class="w-100 position-relative">
            <div class="w-100" :class="{ 'opacity-0': data === null }">
              <LineChartComponent
                label="Rank"
                :reverse="true"
                :data="data?.results?.map((entry) => [entry.time * 1000, entry.rank]) ?? []"
              />
            </div>
            <div class="w-100 position-absolute top-0 left-0">
              <LoadingComponent v-if="data === null" />
            </div>
            <div class="w-100 d-flex justify-content-center" v-if="data?.results?.length === 0">
              <span>No data to display</span>
            </div>
          </div>
        </template>
      </ErrorManager>
    </template>
  </CardComponent>
</template>

<script setup lang="ts">
import LoadingComponent from '@/components/basic/LoadingComponent.vue'
import { ref, watch } from 'vue'
import { APIClient } from '@/api/client'
import CardComponent from '@/components/basic/CardComponent.vue'
import LineChartComponent from '@/components/charts/LineChartComponent.vue'
import ErrorManager from '@/components/management/ErrorManager.vue'

const props = defineProps({
  minDate: { type: Date, required: true },
  maxDate: { type: Date, required: true },
  player: { type: String, required: true }
})

const minDateRef = ref(props.minDate)
const maxDateRef = ref(props.maxDate)
const playerRef = ref(props.player)
const updateRefs = () => {
  minDateRef.value = props.minDate
  maxDateRef.value = props.maxDate
  playerRef.value = props.player
}
const { data, error } = APIClient.getPlayerRanks(minDateRef, maxDateRef, playerRef)
watch(() => [props.player, props.maxDate, props.minDate], updateRefs)
</script>
