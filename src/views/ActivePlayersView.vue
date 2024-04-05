<script setup lang="ts">
import { type Ref, ref } from 'vue'
import { getRankStringFromEloAndRank, ordinalSuffixOf } from '@/utils'
import { APIClient } from '@/api/client'
import { type Player } from '@/api/entities'

const players: Ref<Player[] | null> = ref(null)
const minElo = ref(0)
const maxElo = ref(99999)
const minRank = ref(1)
const maxRank = ref(99999999)
const name = ref('')
function fetchPlayers() {
  players.value = null
  APIClient.getPlayers(minElo.value, maxElo.value, minRank.value, maxRank.value, name.value).then(
    (j) => {
      players.value = j
    }
  )
}
fetchPlayers()
</script>

<template>
  <h2>Active players</h2>
  <span>Shows last 100 active players matching your filters</span>
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
              fetchPlayers()
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
              fetchPlayers()
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
        <label class="form-label">Min. position</label><br />
        <input
          @change="
            (e) => {
              minRank = e.target.value
              fetchPlayers()
            }
          "
          type="number"
          min="1"
          max="999999"
          value="1"
          class="form-check-input form-select-sm"
          style="width: 80px; height: 30px; margin-top: 0px"
        />
      </div>
      <div>
        <label class="form-label">Max. position</label><br />
        <input
          @change="
            (e) => {
              maxRank = e.target.value
              fetchPlayers()
            }
          "
          type="number"
          min="1"
          max="999999"
          value="999999"
          class="form-check-input form-select-sm"
          style="width: 80px; height: 30px; margin-top: 0px"
        />
      </div>
      <div>
        <label class="form-label">Player name</label><br />
        <input
          @change="
            (e) => {
              name = e.target.value
              fetchPlayers()
            }
          "
          type="text"
          class="form-check-input form-select-sm"
          style="width: 120px; height: 30px; margin-top: 0px"
        />
      </div>
      <div>
        <label></label><br />
        <button class="btn btn-primary" @click="fetchPlayers">Refresh</button>
      </div>
    </div>
    <div v-if="players === null">Loading...</div>

    <table class="table table-striped table-sm" data-toggle="table" v-else>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Position</th>
          <th scope="col">Points</th>
          <th scope="col">Rank</th>
          <th scope="col">Activity</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="player in players" :key="player.uuid">
          <td>
            <a :href="`https://trackmania.io/#/player/${player.uuid}`" target="_blank">{{
              player.name
            }}</a>
          </td>
          <td>{{ ordinalSuffixOf(player.rank) }}</td>
          <td>{{ player.points }}</td>
          <td v-html="getRankStringFromEloAndRank(player.points, player.rank, '30px')"></td>
          <td v-if="!player.last_game_finished">
            <a :href="`https://trackmania.io/#/match/${player.last_game_id}`" target="_blank"
              >In match</a
            >
          </td>
          <td v-else>
            <a :href="`https://trackmania.io/#/match/${player.last_game_id}`" target="_blank"
              >Last match on {{ new Date(player.last_active * 1000).toLocaleDateString() }}
              {{ new Date(player.last_active * 1000).toTimeString().split(' ')[0] }}</a
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
