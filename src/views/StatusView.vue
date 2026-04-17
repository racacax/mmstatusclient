<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { ranks } from '@/constants'
import { APIClient } from '@/api/client'
import LoadingComponent from '@/components/basic/LoadingComponent.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import RankComponent from '@/components/basic/RankComponent.vue'
import ErrorManager from '@/components/management/ErrorManager.vue'
import { type Status } from '@/api/entities'
import PeriodFilterComponent from '@/components/basic/PeriodFilterComponent.vue'

const initialMinDate = new Date()
initialMinDate.setHours(initialMinDate.getHours() - 1)
const initialMaxDate = new Date()

const periodFilter = ref()
const currentMinDate = ref(initialMinDate)
const currentMaxDate = ref(initialMaxDate)

watchEffect(() => {
  currentMinDate.value = periodFilter.value?.minDate ?? initialMinDate
  currentMaxDate.value = periodFilter.value?.maxDate ?? initialMaxDate
})

const { data: status, error, loading } = APIClient.getStatus(currentMinDate, currentMaxDate, {})

const getStatusDate = (key: string) => {
  if (status.value === null) return ''
  const value = status.value[key as keyof Status]
  return value && value.last_time ? new Date(value.last_time * 1000).toLocaleString() : 'No match'
}
const getStatusCount = (key: string) => {
  if (status.value === null) return ''
  const value = status.value[key as keyof Status]
  return value ? value.count : '0'
}
</script>

<template>
  <div class="alert alert-info" role="alert">
    <FontAwesomeIcon :icon="faCircleExclamation" /> Interval is now unrestricted. You can look at
    statistics from Spring 2024 until today without being limited to 30 days.
  </div>
  <div class="d-flex flex-md-row-reverse flex-column align-items-end mb-2">
    <PeriodFilterComponent
      ref="periodFilter"
      :allow-time-range="true"
      :initial-min-date="initialMinDate"
      :initial-max-date="initialMaxDate"
    />
    <div class="me-auto">
      <h2>Activity</h2>
      <span>Shows the last time a player of each rank got a match depending on your filters.</span>
    </div>
  </div>
  <hr />
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
              <td>{{ getStatusDate(rank.key) }}</td>
              <td>{{ getStatusCount(rank.key) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </ErrorManager>
</template>
