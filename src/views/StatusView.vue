<script setup lang="ts">
import {ref, watch} from "vue";

  const status = ref(null);
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
    fetch(window.BASE_URL+`/api/status`)
        .then(r => r.json())
        .then(j => {
          status.value = j;
    })
  }
  getStatus()
</script>

<template>
  
  <h2>What is the state of MM ?</h2>
  <span>Show the last time a player of each rank got a game (in the last hour).</span>
  <div class="w-100">
  <div v-if="status === null">
    Loading...
  </div>

    <table class="table table-striped table-sm" data-toggle="table" v-else>
      <thead>
      <tr>
        <th scope="col">Rank</th>
        <th scope="col">Last game</th>
        <th scope="col">Games in the past hour</th>
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
