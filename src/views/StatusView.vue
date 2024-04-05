<script setup lang="ts">
import {ref, watch} from "vue";

  const status = ref(null);
  const minDate = ref(Math.round(new Date().getTime() / 1000 - 3600));
  const maxDate = ref(Math.round(new Date().getTime() / 1000));
  const ranks = [{"name": "Trackmaster", "image": "TM.png", "key": "tm"},
    {"name": "Master III", "image": "M3.png", "key": "m3"},
    {"name": "Master II", "image": "M2.png", "key": "m2"},
    {"name": "Master I", "image": "M1.png", "key": "m1"},
    {"name": "Gold III", "image": "G3.png", "key": "g3"},
    {"name": "Gold II", "image": "G2.png", "key": "g2"},
    {"name": "Gold I", "image": "G1.png", "key": "g1"},
    {"name": "Silver III", "image": "S3.png", "key": "s3"},
    {"name": "Silver II", "image": "S2.png", "key": "s2"},
    {"name": "Silver I", "image": "S1.png", "key": "s1"},
    {"name": "Bronze III", "image": "B3.png", "key": "b3"},
    {"name": "Bronze II", "image": "B2.png", "key": "b2"},
    {"name": "Bronze I", "image": "B1.png", "key": "b1"},
  ]
  function getStatus() {
    status.value = null;
    //@ts-ignore
    fetch(window.BASE_URL+`/api/status?min_date=${minDate.value}&max_date=${maxDate.value}`)
        .then(r => r.json())
        .then(j => {
          status.value = j;
    })
  }
  getStatus()

  function getLocalDate(date: Date) {
    date = new Date(date.getTime())
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0,16)
  }
</script>

<template>
  
  <h2>What is the state of MM ?</h2>
  <span>Show the last time a player of each rank got a game depending on your filters. Data gathering started on 04/04/2024.</span>
  <div><span>Statistics between </span><input
      class="form-check-input"
      style="width:180px; height:30px"
      type="datetime-local"
      :value="getLocalDate(new Date(minDate * 1000))"
      min="2024-04-03T00:00"
      :max="getLocalDate(new Date(maxDate * 1000))" @change="(e) => {
        minDate = Math.round(new Date(e.target.value).getTime() / 1000)
      }"
      /> <span>and</span> <input
      class="form-check-input"
      style="width:180px; height:30px"
      type="datetime-local"
      :value="getLocalDate(new Date(maxDate * 1000))"
      :min="getLocalDate(new Date(minDate * 1000))" @change="(e) => {
        maxDate = Math.round(new Date(e.target.value).getTime() / 1000)
      }"
  /> <input type="button" class="btn btn-primary" value="Search" @click="getStatus"></div>
  <div class="w-100">
  <div v-if="status === null">
    Loading...
  </div>

    <table class="table table-striped table-sm" data-toggle="table" v-else>
      <thead>
      <tr>
        <th scope="col">Rank</th>
        <th scope="col">Most recent game (in the interval)</th>
        <th scope="col">Total games (in the interval)</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="rank in ranks">
        <td><img :src="`/images/${rank.image}`" style="width: 60px" /> {{ rank.name }}</td>
        <td>{{ status[rank.key] ? new Date(status[rank.key]["last_time"] * 1000).toLocaleTimeString() : "No game" }}</td>
        <td>{{ status[rank.key] ? status[rank.key].count : "0" }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
