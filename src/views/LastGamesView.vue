<script setup lang="ts">
import { type Ref, ref, watch } from 'vue'
import { APIClient } from '@/api/client'
import { type Game } from '@/api/entities'

const games: Ref<Game[] | null> = ref(null)
const minElo = ref(0)
const maxElo = ref(99999)
function fetchLastGames() {
  games.value = null
  APIClient.getLastGames(minElo.value, maxElo.value).then((j) => {
    games.value = j
  })
}
fetchLastGames()
</script>

<template>
  <h2>Last games</h2>
  <span>Shows the last 80 games matching your filters</span>
  <div class="w-100">
    <div class="d-flex gap-2">
      <div>
        <label class="form-label">Min. rank</label>
        <select
          class="form-select form-select-sm"
          aria-label="Min-elo"
          @change="
            (e) => {
              minElo = e.target.value
              fetchLastGames()
            }
          "
        >
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
        <select
          class="form-select form-select-sm"
          aria-label="Min-elo"
          @change="
            (e) => {
              maxElo = e.target.value
              fetchLastGames()
            }
          "
        >
          <option value="299">Bronze I</option>
          <option value="599">Bronze II</option>
          <option value="999">Bronze III</option>
          <option value="1299">Silver I</option>
          <option value="1599">Silver II</option>
          <option value="1999">Silver III</option>
          <option value="2299">Gold I</option>
          <option value="2599">Gold II</option>
          <option value="2999">Gold III</option>
          <option value="3299">Master I</option>
          <option value="3599">Master II</option>
          <option value="3999">Master III (-4000 pts)</option>
          <option selected value="9999999">Trackmaster (4000+ pts)</option>
        </select>
      </div>
      <div>
        <label></label><br />
        <button class="btn btn-primary" @click="fetchLastGames">Refresh</button>
      </div>
    </div>
    <div v-if="games === null">Loading...</div>

    <table class="table table-striped table-sm" data-toggle="table" v-else>
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Map name</th>
          <th scope="col">Avg. points</th>
          <th scope="col">Min. points</th>
          <th scope="col">Max. points</th>
          <th scope="col">Status</th>
          <th scope="col">Started on</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="game in games" :key="game.id">
          <td>
            <a :href="`https://trackmania.io/#/match/${game.id}`" target="_blank">{{ game.id }}</a>
          </td>
          <td>
            <a :href="`https://trackmania.io/#/leaderboard/${game.map.uid}`" target="_blank">{{
              game.map.name
            }}</a>
          </td>
          <td>{{ game.average_elo }}</td>
          <td>{{ game.min_elo }}</td>
          <td>{{ game.max_elo }}</td>
          <td v-if="!game.is_finished">
            <a :href="`https://trackmania.io/#/match/${game.id}`" target="_blank">Active</a>
          </td>
          <td v-else>
            <a :href="`https://trackmania.io/#/match/${game.id}`" target="_blank">Completed</a>
          </td>
          <td>
            {{ new Date(game.time * 1000).toLocaleDateString() }}
            {{ new Date(game.time * 1000).toTimeString().split(' ')[0] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
