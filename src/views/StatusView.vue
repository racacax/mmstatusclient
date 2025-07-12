<script setup lang="ts">
import { ref } from 'vue'
import { ranks } from '@/constants'
import { APIClient } from '@/api/client'
import LoadingComponent from '@/components/basic/LoadingComponent.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faWandMagicSparkles, faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import RankComponent from '@/components/basic/RankComponent.vue'
import { getEventValue, getLocalDate } from '@/utils'
import ErrorManager from '@/components/management/ErrorManager.vue'
import { type Status } from '@/api/entities'

const minDate = ref(new Date())
minDate.value.setHours(minDate.value.getHours() - 1)
const maxDate = ref(new Date())
const {
  data: status,
  error,
  loading,
  fetchFn: fetchStatus
} = APIClient.getStatus(minDate, maxDate, { lazy: true })
fetchStatus()

const getStatusDate = (key: string) => {
  if (status.value === null) {
    return ''
  }
  const value = status.value[key as keyof Status]
  return value && value.last_time
    ? new Date(value.last_time * 1000).toLocaleTimeString()
    : 'No match'
}
const getStatusCount = (key: string) => {
  if (status.value === null) {
    return ''
  }
  const value = status.value[key as keyof Status]
  return value ? value.count : '0'
}
</script>

<template>
  <div class="alert alert-info" role="alert">
    <FontAwesomeIcon :icon="faCircleExclamation" /> Interval is now unrestricted. You can look at
    statistics from Spring 2024 until today without being limited to 30 days.
  </div>
  <h2>What is the state of MM ?</h2>
  <span>Shows the last time a player of each rank got a match depending on your filters.</span>
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
      <FontAwesomeIcon :icon="faWandMagicSparkles" />
      Apply
    </div>
  </div>
  <ErrorManager :error="error">
    <template #body>
      <div class="w-100">
        <LoadingComponent v-if="loading || status === null" />
        <table class="table table-striped table-sm" data-toggle="table" v-else>
          <thead>
            <tr>
              <th scope="col">Rank</th>
              <th scope="col">Most recent match (in the interval)</th>
              <th scope="col">Total matches (in the interval)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rank in ranks" :key="rank.key">
              <td>
                <RankComponent :elo="rank.minElo" :rank="rank.minRank" width="40px" />
              </td>
              <td>
                {{ getStatusDate(rank.key) }}
              </td>
              <td>{{ getStatusCount(rank.key) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </ErrorManager>
</template>
<style scoped type="text/css">
.datetime {
  width: 180px;
  height: 38px;
  margin-top: 0;
}
</style>
