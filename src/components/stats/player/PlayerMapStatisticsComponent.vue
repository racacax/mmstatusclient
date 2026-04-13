<script setup lang="ts">
import LoadingComponent from '@/components/basic/LoadingComponent.vue'
import { ref, type Ref, toRef, watch } from 'vue'
import { APIClient } from '@/api/client'
import ErrorManager from '@/components/management/ErrorManager.vue'
import SelectInputComponent from '@/components/basic/SelectInputComponent.vue'
import NumberInputComponent from '@/components/basic/NumberInputComponent.vue'

const props = defineProps<{
  minDate: Date
  maxDate: Date
  player: string
}>()

const orderByOptions = [
  { value: 'played', label: 'Played' },
  { value: 'wins', label: 'Wins' },
  { value: 'winrate', label: 'Win-rate' },
  { value: 'losses', label: 'Losses' },
  { value: 'lossrate', label: 'Loss-rate' },
  { value: 'mvps', label: 'MVPs' },
  { value: 'mvprate', label: 'MVP-rate' }
]
const orderOptions = [
  { value: 'desc', label: 'Descending' },
  { value: 'asc', label: 'Ascending' }
]

const orderBy = ref('played')
const order: Ref<'desc' | 'asc'> = ref('desc')
const page = ref(1)

const {
  data: stats,
  error,
  loading
} = APIClient.getPlayerMapStatistics(
  toRef(props, 'minDate'),
  toRef(props, 'maxDate'),
  toRef(props, 'player'),
  orderBy,
  order,
  page
)
watch([order, orderBy, () => props.player, () => props.minDate, () => props.maxDate], () => {
  page.value = 1
})
</script>
<template>
  <div class="mb-2 col-lg-6 col-12 flex-column align-items-stretch d-flex px-1">
    <div class="card w-100 p-2">
      <div class="d-flex justify-content-between align-items-center w-100">
        <h5>Maps</h5>
        <div class="d-flex gap-2 flex-wrap">
          <SelectInputComponent
            label="Order by"
            :options="orderByOptions"
            :model-value="orderBy"
            @update:model-value="orderBy = $event"
          />
          <SelectInputComponent
            label="Order"
            :options="orderOptions"
            :model-value="order"
            @update:model-value="order = $event as 'desc' | 'asc'"
          />
          <NumberInputComponent
            label="Page"
            :model-value="page"
            :min="1"
            @update:model-value="page = $event"
          />
        </div>
      </div>
      <ErrorManager :error="error">
        <template #body>
          <LoadingComponent v-if="loading || stats === null" />
          <div v-else>
            <table class="table table-striped table-sm" data-toggle="table">
              <thead>
                <tr>
                  <th scope="col">Map</th>
                  <th scope="col">Played</th>
                  <th scope="col">Wins</th>
                  <th scope="col">Losses</th>
                  <th scope="col">MVPs</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(stat, i) in stats.results" :key="i">
                  <td>
                    <a
                      target="_blank"
                      :href="`https://trackmania.io/#/leaderboard/${stat.map_uid}`"
                      >{{ stat.map_name }}</a
                    >
                  </td>
                  <td>{{ stat.played }}</td>
                  <td>{{ stat.wins }} ({{ Math.round(stat.winrate) }} %)</td>
                  <td>{{ stat.losses }} ({{ Math.round(stat.lossrate) }} %)</td>
                  <td>{{ stat.mvps }} ({{ Math.round(stat.mvprate) }} %)</td>
                </tr>
              </tbody>
            </table>
            <div class="w-100 d-flex justify-content-center" v-if="stats.results.length === 0">
              <span>No data to display</span>
            </div>
          </div>
        </template>
      </ErrorManager>
    </div>
  </div>
</template>

<style scoped></style>
