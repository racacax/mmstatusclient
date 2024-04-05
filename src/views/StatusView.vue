<script setup lang="ts">
import { type Ref, ref, watch } from 'vue'
import { ranks } from '@/constants'
import { APIClient } from '@/api/client'
import { type Status } from '@/api/entities'

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

function getLocalDate(date: Date) {
  date = new Date(date.getTime())
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
  return date.toISOString().slice(0, 16)
}
</script>

<template>
  <h2>What is the state of MM ?</h2>
  <span
    >Show the last time a player of each rank got a game depending on your filters. Data gathering
    started on 04/04/2024.</span
  >
  <div>
    <span>Statistics between </span
    ><input
      class="form-check-input"
      style="width: 180px; height: 30px"
      type="datetime-local"
      :value="getLocalDate(minDate)"
      min="2024-04-03T00:00"
      :max="getLocalDate(maxDate)"
      @change="
        (e) => {
          minDate = new Date(e.target.value)
        }
      "
    />
    <span>and</span>
    <input
      class="form-check-input"
      style="width: 180px; height: 30px"
      type="datetime-local"
      :value="getLocalDate(maxDate)"
      :min="getLocalDate(minDate)"
      @change="
        (e) => {
          maxDate = new Date(e.target.value)
        }
      "
    />
    <input type="button" class="btn btn-primary" value="Search" @click="fetchStatus" />
  </div>
  <div class="w-100">
    <div v-if="status === null">Loading...</div>

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
          <td><img :src="`/images/${rank.image}`" style="width: 60px" /> {{ rank.name }}</td>
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
