<template>
  <div class="mb-2 card pt-2 d-flex col-12 flex-column">
    <div class="d-flex justify-content-between align-items-center w-100">
      <h5>Opponents</h5>
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
            <option value="played_against">Played against</option>
            <option value="played_along">Played along</option>
            <option value="games_lost_against">Losses against</option>
            <option value="games_won_against">Wins against</option>
            <option value="games_lost_along">Losses along</option>
            <option value="games_won_along">Wins along</option>
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
          <th scope="col">Player</th>
          <th scope="col">Played</th>
          <th scope="col">As teammate</th>
          <th scope="col">As opponent</th>
          <th scope="col">Wins against</th>
          <th scope="col">Losses against</th>
          <th scope="col">Wins along</th>
          <th scope="col">Losses along</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(stat, i) in stats.results" :key="i">
          <td>
            <a target="_blank" :href="`https://trackmania.io/#/player/${stat.uuid}`">{{
              stat.name
            }}</a>
          </td>
          <td>{{ stat.total_played }}</td>
          <td>{{ stat.total_played_along }}</td>
          <td>{{ stat.total_played_against }}</td>
          <td>
            {{ stat.total_games_won_against }} ({{
              Math.round((stat.total_games_won_against * 100) / stat.total_played_against)
            }}
            %)
          </td>
          <td>
            {{ stat.total_games_lost_against }} ({{
              Math.round((stat.total_games_lost_against * 100) / stat.total_played_against)
            }}
            %)
          </td>
          <td>
            {{ stat.total_games_won_along }} ({{
              Math.round((stat.total_games_won_along * 100) / stat.total_played_along)
            }}
            %)
          </td>
          <td>
            {{ stat.total_games_lost_along }} ({{
              Math.round((stat.total_games_lost_along * 100) / stat.total_played_along)
            }}
            %)
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import LoadingComponent from '@/components/LoadingComponent.vue'
import { ref, type Ref, watch } from 'vue'
import { type OpponentsStatistics } from '@/api/entities'
import { APIClient } from '@/api/client'

const props = defineProps({
  minDate: Date,
  maxDate: Date,
  player: String
})

const stats: Ref<OpponentsStatistics | null> = ref(null)

const orderBy = ref('played')
const order: Ref<'desc' | 'asc'> = ref('desc')
function fetchStats() {
  stats.value = null
  if (props.minDate === undefined || props.maxDate === undefined || props.player === undefined) {
    return
  }
  APIClient.getPlayerOpponentsStatistics(
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
