<template>
  <div class="mb-2 card pt-2 d-flex col-lg-7 col-12 flex-column">
    <div class="d-flex justify-content-between align-items-center w-100">
      <h5>Maps</h5>
      <div class="d-flex gap-2">
        <div
          class="d-flex flex-column gap-2"
          @change="
            (e) => {
              orderBy = e.target.value
            }
          "
        >
          Order by:
          <select class="form-select form-select-sm">
            <option value="played" selected>Played</option>
            <option value="wins">Wins</option>
            <option value="winrate">Win-rate</option>
            <option value="losses">Losses</option>
            <option value="lossrate">Loss-rate</option>
            <option value="mvps">MVPs</option>
            <option value="mvprate">MVP-rate</option>
          </select>
        </div>

        <div
          class="d-flex flex-column gap-2"
          @change="
            (e) => {
              order = e.target.value
            }
          "
        >
          Order:
          <select class="form-select form-select-sm">
            <option value="desc" selected>Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>
    </div>
    <LoadingComponent v-if="stats === null" />
    <table class="table table-striped table-sm" data-toggle="table" v-else>
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
            <a target="_blank" :href="`https://trackmania.io/#/leaderboard/${stat.map_uid}`">{{
              stat.map_name
            }}</a>
          </td>
          <td>{{ stat.played }}</td>
          <td>{{ stat.wins }} ({{ Math.round(stat.winrate) }} %)</td>
          <td>{{ stat.losses }} ({{ Math.round(stat.lossrate) }} %)</td>
          <td>{{ stat.mvps }} ({{ Math.round(stat.mvprate) }} %)</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import LoadingComponent from '@/components/LoadingComponent.vue'
import { ref, type Ref, watch } from 'vue'
import { type PlayerMapStatistics } from '@/api/entities'
import { APIClient } from '@/api/client'

const props = defineProps({
  minDate: Date,
  maxDate: Date,
  player: String
})

const stats: Ref<PlayerMapStatistics | null> = ref(null)

const orderBy = ref('played')
const order: Ref<'desc' | 'asc'> = ref('desc')
function fetchStats() {
  stats.value = null
  if (props.minDate === undefined || props.maxDate === undefined || props.player === undefined) {
    return
  }
  APIClient.getPlayerMapStatistics(
    props.minDate,
    props.maxDate,
    props.player,
    orderBy.value,
    order.value
  ).then((j) => {
    stats.value = j
  })
}
fetchStats()
watch(() => [props.player, props.maxDate, props.minDate], fetchStats)
watch([order, orderBy], fetchStats)
</script>

<style scoped></style>
