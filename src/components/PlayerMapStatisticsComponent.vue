<script setup lang="ts">
import LoadingComponent from '@/components/LoadingComponent.vue'
import { ref, type Ref, watch } from 'vue'
import { APIClient } from '@/api/client'
import { getEventValue } from '@/utils'
import ErrorManager from '@/components/management/ErrorManager.vue'

const props = defineProps({
  minDate: { type: Date, required: true },
  maxDate: { type: Date, required: true },
  player: { type: String, required: true }
})

const orderBy = ref('played')
const order: Ref<'desc' | 'asc'> = ref('desc')
const page = ref(1)
const minDateRef = ref(props.minDate)
const maxDateRef = ref(props.maxDate)
const playerRef = ref(props.player)
const updateRefs = () => {
  minDateRef.value = props.minDate
  maxDateRef.value = props.maxDate
  playerRef.value = props.player
}
const {
  data: stats,
  error,
  loading
} = APIClient.getPlayerMapStatistics(minDateRef, maxDateRef, playerRef, orderBy, order, page)
watch(() => [props.player, props.maxDate, props.minDate], updateRefs)
watch([order, orderBy], () => {
  page.value = 1
})
</script>
<template>
  <div class="mb-2 col-lg-6 col-12 flex-column align-items-stretch d-flex px-1">
    <div class="card w-100 p-2">
      <div class="d-flex justify-content-between align-items-center w-100">
        <h5>Maps</h5>
        <div class="d-flex gap-2">
          <div class="d-flex flex-column gap-2">
            Order by:
            <select
              class="form-select form-select-sm"
              @change="
                (e) => {
                  orderBy = getEventValue(e)
                }
              "
            >
              <option value="played" selected>Played</option>
              <option value="wins">Wins</option>
              <option value="winrate">Win-rate</option>
              <option value="losses">Losses</option>
              <option value="lossrate">Loss-rate</option>
              <option value="mvps">MVPs</option>
              <option value="mvprate">MVP-rate</option>
            </select>
          </div>

          <div class="d-flex flex-column gap-2">
            Order:
            <select
              class="form-select form-select-sm"
              @change="
                (e) => {
                  order = getEventValue(e)
                }
              "
            >
              <option value="desc" selected>Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>

          <div class="d-flex flex-column gap-2">
            Page:
            <input
              class="form-control form-control-sm"
              style="max-width: 80px"
              :value="page"
              min="1"
              @change="
                (e) => {
                  page = parseInt(getEventValue(e))
                }
              "
              type="number"
            />
          </div>
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
