<template>
  <div class="col-12 col-lg-8 px-1 align-items-stretch d-flex">
    <div class="mb-2 card d-flex flex-column p-2 w-100 overflow-x-scroll overflow-x-lg-hidden">
      <div class="d-flex justify-content-between align-items-center w-100">
        <h5>Opponents</h5>
        <div class="d-flex gap-2">
          <div class="d-flex flex-column gap-2">
            Group by:
            <select
              class="form-select form-select-sm"
              @change="
                (e) => {
                  groupBy = getEventValue(e)
                }
              "
            >
              <option value="uuid" selected>Player</option>
              <option value="country">Country</option>
              <option value="club_tag">Club</option>
            </select>
          </div>
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
      <ErrorManager :error="error">
        <template #body>
          <LoadingComponent v-if="loading || stats === null" />
          <div v-else>
            <table class="table table-striped table-sm" data-toggle="table">
              <thead>
                <tr>
                  <th scope="col"></th>
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
                  <td v-if="groupBy == 'uuid'">
                    <a target="_blank" :href="`/#/statistics/${stat.uuid}`">{{ stat.name }}</a>
                  </td>
                  <td v-if="groupBy == 'country'">
                    {{ countryCodeEmoji(getCountryISO2(stat.country_alpha3)) }} {{ stat.name }}
                  </td>
                  <td v-if="groupBy == 'club_tag'" v-html="formatClubTag(stat)"></td>
                  <td>{{ stat.total_played }}</td>
                  <td>{{ stat.total_played_along }}</td>
                  <td>{{ stat.total_played_against }}</td>
                  <td>
                    <div class="d-flex flex-wrap gap-1">
                      <span>{{ stat.total_games_won_against }}</span>
                      <span style="white-space: nowrap"
                        >({{
                          Math.round(
                            (stat.total_games_won_against * 100) / stat.total_played_against
                          )
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
                          Math.round(
                            (stat.total_games_lost_against * 100) / stat.total_played_against
                          )
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
        </template>
      </ErrorManager>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoadingComponent from '@/components/basic/LoadingComponent.vue'
import { ref, type Ref, watch } from 'vue'
import { APIClient } from '@/api/client'
import { getEventValue } from '@/utils'
import ErrorManager from '@/components/management/ErrorManager.vue'
import getCountryISO2 from 'country-iso-3-to-2'
import { countryCodeEmoji } from 'country-code-emoji'
import { MPStyle } from '@tomvlk/ts-maniaplanet-formatter'
import type { OpponentsStatisticsResult } from '@/api/entities'

const props = defineProps({
  minDate: { type: Date, required: true },
  maxDate: { type: Date, required: true },
  player: { type: String, required: true }
})

const orderBy = ref('played')
const groupBy = ref<'uuid' | 'club_tag' | 'country'>('uuid')
const order: Ref<'desc' | 'asc'> = ref('desc')
const page = ref(1)
const {
  data: stats,
  error,
  loading
} = APIClient.getPlayerOpponentsStatistics(() => ({
  min_date: props.minDate,
  max_date: props.maxDate,
  page: page.value,
  player: props.player,
  order: order.value,
  order_by: orderBy.value,
  group_by: groupBy.value
}))
watch([order, orderBy], () => {
  page.value = 1
})
const formatClubTag = (stat: OpponentsStatisticsResult) => {
  return `<span style="font-size:18.71px">${MPStyle(stat.club_tag ?? 'No tag')}</span>`
}
</script>

<style scoped>
@media screen and (min-width: 762px) {
  .overflow-x-lg-hidden {
    overflow-x: hidden !important;
  }
}
</style>
