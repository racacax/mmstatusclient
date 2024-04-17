<template>
  <div class="d-flex justify-content-between">
    <h5>Maps</h5>
  </div>
  <LoadingComponent v-if="stats === null" />
  <table class="table table-striped table-sm" data-toggle="table" v-else>
    <thead>
      <tr>
        <th scope="col"></th>
        <th scope="col">Map</th>
        <th scope="col">Total matches</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(stat, i) in stats.results" :key="stat.key">
        <td>{{ i + 1 }}</td>
        <td>
          <a target="_blank" :href="`https://trackmania.io/#/leaderboard/${stat.map_uid}`">{{
            stat.map_name
          }}</a>
        </td>
        <td>{{ stat.total_played }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import LoadingComponent from '@/components/LoadingComponent.vue'
import { ref, type Ref } from 'vue'
import { type MapsStatistics } from '@/api/entities'
import { APIClient } from '@/api/client'

const props = defineProps({
  minDate: Date,
  maxDate: Date
})

const stats: Ref<MapsStatistics | null> = ref(null)

function fetchStats() {
  stats.value = null

  APIClient.getMapsStatistics(props.minDate, props.maxDate).then((j) => {
    stats.value = j
  })
}
fetchStats()
</script>

<style scoped></style>
