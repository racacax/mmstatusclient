<template>
  <div class="col-12 col-lg-8 px-1 align-items-stretch d-flex">
    <div class="mb-2 card d-flex flex-column p-2 w-100 overflow-x-scroll overflow-x-lg-hidden">
      <div class="d-flex justify-content-between align-items-center w-100">
        <h5>Opponents</h5>
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
              <option value="played_against">As opponent</option>
              <option value="played_along">As teammate</option>
              <option value="games_lost_against">Losses against</option>
              <option value="games_won_against">Wins against</option>
              <option value="games_lost_along">Losses along</option>
              <option value="games_won_along">Wins along</option>
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
      <LoadingComponent v-if="stats === null" />
      <div v-else>
        <table class="table table-striped table-sm" data-toggle="table">
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
                <div class="d-flex flex-wrap gap-1">
                  <span>{{ stat.total_games_won_against }}</span>
                  <span style="white-space: nowrap"
                    >({{
                      Math.round((stat.total_games_won_against * 100) / stat.total_played_against)
                    }}
                    %)</span
                  >
                </div>
              </td>
              <td>
                <div class="d-flex flex-wrap gap-1">
                  <span>{{ stat.total_games_lost_against }}</span>
                  <span style="white-space: nowrap"
                    >({{
                      Math.round((stat.total_games_lost_against * 100) / stat.total_played_against)
                    }}
                    %)</span
                  >
                </div>
              </td>
              <td>
                <div class="d-flex flex-wrap gap-1">
                  <span>{{ stat.total_games_won_along }}</span>
                  <span style="white-space: nowrap"
                    >({{
                      Math.round((stat.total_games_won_along * 100) / stat.total_played_along)
                    }}
                    %)</span
                  >
                </div>
              </td>
              <td>
                <div class="d-flex flex-wrap gap-1">
                  <span>{{ stat.total_games_lost_along }}</span>
                  <span style="white-space: nowrap"
                    >({{
                      Math.round((stat.total_games_lost_along * 100) / stat.total_played_along)
                    }}
                    %)</span
                  >
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="w-100 d-flex justify-content-center" v-if="stats.results.length === 0">
          <span>No data to display</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoadingComponent from '@/components/LoadingComponent.vue'
import { ref, type Ref, watch } from 'vue'
import { type OpponentsStatistics } from '@/api/entities'
import { APIClient } from '@/api/client'
import { getEventValue } from '@/utils'

const props = defineProps({
  minDate: { type: Date, required: true },
  maxDate: { type: Date, required: true },
  player: { type: String, required: true }
})

const stats: Ref<OpponentsStatistics | null> = ref(null)

const orderBy = ref('played')
const order: Ref<'desc' | 'asc'> = ref('desc')
const page = ref(1)
function fetchStats() {
  stats.value = null
  APIClient.getPlayerOpponentsStatistics(
    props.minDate,
    props.maxDate,
    props.player,
    orderBy.value,
    order.value,
    page.value
  ).then((j) => {
    stats.value = j
  })
}
fetchStats()
watch(
  () => [props.player, props.maxDate, props.minDate],
  () => {
    page.value = 1
    fetchStats()
  }
)
watch([order, orderBy], () => {
  page.value = 1;
  fetchStats()
})
watch([page], fetchStats)
</script>

<style scoped>
@media screen and (min-width: 762px) {
  .overflow-x-lg-hidden {
    overflow-x: hidden !important;
  }
}
</style>
