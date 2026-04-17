<template>
  <div class="col-12 col-lg-8 px-1 align-items-stretch d-flex">
    <div class="mb-2 card d-flex flex-column p-2 w-100 overflow-x-scroll overflow-x-lg-hidden">
      <div class="d-flex justify-content-between align-items-center w-100">
        <h5>Opponents</h5>
        <div class="d-flex gap-2 flex-wrap">
          <SelectInputComponent
            label="Group by"
            :options="groupByOptions"
            :model-value="groupBy"
            @update:model-value="groupBy = $event as 'uuid' | 'club_tag' | 'country'"
          />
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
                    <img
                      v-if="stat.country"
                      :src="`/flags/${stat.country.file_name}`"
                      :alt="stat.country.name"
                      class="player-flag"
                    />
                    <a target="_blank" :href="`/#/player-statistics/${stat.uuid}`">
                      <span v-if="stat.club_tag"
                        >[<span v-html="MPStyle(stat.club_tag)"></span>]&nbsp;</span
                      >{{ stat.name }}
                    </a>
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
import ErrorManager from '@/components/management/ErrorManager.vue'
import getCountryISO2 from 'country-iso-3-to-2'
import { countryCodeEmoji } from 'country-code-emoji'
import { renderMPStyle as MPStyle } from '@/utils'
import type { OpponentsStatisticsResult } from '@/api/entities'
import SelectInputComponent from '@/components/basic/SelectInputComponent.vue'
import NumberInputComponent from '@/components/basic/NumberInputComponent.vue'

const props = defineProps({
  minDate: { type: Date, required: true },
  maxDate: { type: Date, required: true },
  player: { type: String, required: true }
})

const groupByOptions = [
  { value: 'uuid', label: 'Player' },
  { value: 'country', label: 'Country' },
  { value: 'club_tag', label: 'Club' }
]
const orderByOptions = [
  { value: 'played', label: 'Played' },
  { value: 'played_against', label: 'As opponent' },
  { value: 'played_along', label: 'As teammate' },
  { value: 'games_lost_against', label: 'Losses against' },
  { value: 'games_won_against', label: 'Wins against' },
  { value: 'games_lost_along', label: 'Losses along' },
  { value: 'games_won_along', label: 'Wins along' }
]
const orderOptions = [
  { value: 'desc', label: 'Descending' },
  { value: 'asc', label: 'Ascending' }
]

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
  group_by: groupBy.value,
  limit: 13
}))
watch([order, orderBy, () => props.player, () => props.minDate, () => props.maxDate], () => {
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
.player-flag {
  height: 20px;
  margin-right: 3px;
  vertical-align: middle;
}
</style>
