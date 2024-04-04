<script setup lang="ts">
import {ref, watch} from "vue";

  const players = ref(null);
  const minElo = ref(0);
  const maxElo = ref(99999);
  const minRank = ref(1);
  const maxRank = ref(99999999);
  function getPlayers() {
    players.value = null;
    //@ts-ignore
    fetch(window.BASE_URL+`/api/players?min_elo=${minElo.value}&max_elo=${maxElo.value}&min_rank=${minRank.value}&max_rank=${maxRank.value}`)
        .then(r => r.json())
        .then(j => {
          players.value = j;
    })
  }
  getPlayers()
</script>

<template>

  <h2>Active players</h2>
  <span>Shows all players that played a game in the last 100 active players</span>
  <div class="w-100">
    <div class="d-flex gap-2">
      <div>
        <label class="form-label">Min. rank</label>
        <select class="form-select form-select-sm" aria-label="Min-elo" @change="(e) => {minElo = e.target.value; getPlayers()}">
          <option selected value="0">Bronze I</option>
          <option value="300">Bronze II</option>
          <option value="600">Bronze III</option>
          <option value="1000">Silver I</option>
          <option value="1300">Silver II</option>
          <option value="1600">Silver III</option>
          <option value="2000">Gold I</option>
          <option value="2300">Gold II</option>
          <option value="2600">Gold III</option>
          <option value="3000">Master I</option>
          <option value="3300">Master II</option>
          <option value="3600">Master III</option>
          <option value="4000">Trackmaster (4000 pts)</option>
        </select>
      </div>
      <div>
        <label class="form-label">Max. rank</label>
        <select class="form-select form-select-sm" aria-label="Min-elo" @change="(e) => {maxElo = e.target.value; getPlayers()}">
          <option value="0">Bronze I</option>
          <option value="300">Bronze II</option>
          <option value="600">Bronze III</option>
          <option value="1000">Silver I</option>
          <option value="1300">Silver II</option>
          <option value="1600">Silver III</option>
          <option value="2000">Gold I</option>
          <option value="2300">Gold II</option>
          <option value="2600">Gold III</option>
          <option value="3000">Master I</option>
          <option value="3300">Master II</option>
          <option value="3600">Master III</option>
          <option selected value="9999999">Trackmaster</option>
        </select>
      </div>
      <div>
        <label class="form-label">Min. position</label><br/>
        <input @change="(e) => {minRank = e.target.value; getPlayers()}" type="number" min="1" max="999999" value="1" class="form-check-input form-select-sm" style="width: 80px; height: 30px; margin-top: 0px"/>
      </div>
      <div>
        <label class="form-label">Max. position</label><br/>
        <input @change="(e) => {maxRank = e.target.value; getPlayers()}" type="number" min="1" max="999999" value="999999" class="form-check-input form-select-sm" style="width: 80px; height: 30px; margin-top: 0px"/>
      </div>
      <div>
        <label></label><br/>
        <button class="btn btn-primary" @click="getPlayers">Refresh</button>
      </div>
    </div>
  <div v-if="players === null">
    Loading...
  </div>

    <table class="table table-striped table-sm" data-toggle="table" v-else>
      <thead>
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Position</th>
        <th scope="col">Points</th>
        <th scope="col">Activity</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="player in players">
        <td><a :href="`https://trackmania.io/#/player/${player.uuid}`" target="_blank">{{ player.name }}</a></td>
        <td>{{ player.rank }}th</td>
        <td>{{ player.points }}</td>
        <td v-if="!player.last_game_finished"><a :href="`https://trackmania.io/#/match/${player.last_game_id}`" target="_blank">In match</a></td>
        <td v-else><a :href="`https://trackmania.io/#/match/${player.last_game_id}`" target="_blank">Last match on {{ new Date(player.last_active * 1000).toLocaleDateString() }} {{ new Date(player.last_active * 1000).toTimeString().split(' ')[0] }}</a></td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
