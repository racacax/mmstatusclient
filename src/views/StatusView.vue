<script setup lang="ts">
import { type Ref, ref } from 'vue'
import { ranks } from '@/constants'
import { APIClient } from '@/api/client'
import { type Status } from '@/api/entities'
import LoadingComponent from '@/components/LoadingComponent.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons'
import RankComponent from '@/components/RankComponent.vue'
import { getEventValue, getLocalDate } from '@/utils'

const status: Ref<Status | null> = ref(null)
const minDate = ref(new Date())
minDate.value.setHours(minDate.value.getHours() - 1)
const maxDate = ref(new Date())

function fetchStatus() {
  status.value = null

  APIClient.getStatus(minDate.value, maxDate.value).then((j) => {
    status.value = j
  })
}
fetchStatus()
</script>

<template>
  <h2>What is the state of MM ?</h2>
  <span>Shows the last time a player of each rank got a game depending on your filters.</span>
  <div>
    <span>Statistics between </span
    ><input
      class="form-check-input rounded-1 datetime"
      type="datetime-local"
      :value="getLocalDate(minDate)"
      min="2024-04-03T00:00"
      :max="getLocalDate(maxDate)"
      @change="
        (e) => {
          minDate = new Date(getEventValue(e))
        }
      "
    />
    <span> and </span>
    <input
      class="form-check-input rounded-1 datetime"
      type="datetime-local"
      :value="getLocalDate(maxDate)"
      :min="getLocalDate(minDate)"
      @change="
        (e) => {
          maxDate = new Date(getEventValue(e))
        }
      "
    />
    <div type="button" class="btn btn-primary mx-1" @click="fetchStatus">
      <FontAwesomeIcon :icon="faWandMagicSparkles" /> Apply
    </div>
  </div>
  <div class="w-100">
    <LoadingComponent v-if="status === null" />
    <table class="table table-striped table-sm" data-toggle="table" v-else>
      <thead>
        <tr>
          <th scope="col">Rank</th>
          <th scope="col">Most recent game (in the interval)</th>
          <th scope="col">Total games (in the interval)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="rank in ranks" :key="rank.key">
          <td><RankComponent :elo="rank.minElo" :rank="rank.minRank" width="40px" /></td>
          <td>
            {{
              status[rank.key]
                ? new Date(status[rank.key]['last_time'] * 1000).toLocaleTimeString()
                : 'No game'
            }}
          </td>
          <td>{{ status[rank.key] ? status[rank.key].count : '0' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<style scoped type="text/css">
.datetime {
  width: 180px;
  height: 38px;
  margin-top: 0;
}
</style>
