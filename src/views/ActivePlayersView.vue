<script setup lang="ts">
import { ref } from 'vue'
import { getEventValue, ordinalSuffixOf } from '@/utils'
import { APIClient } from '@/api/client'
import LoadingComponent from '@/components/basic/LoadingComponent.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faBackward, faBackwardFast, faForward } from '@fortawesome/free-solid-svg-icons'
import RankComponent from '@/components/basic/RankComponent.vue'
import ErrorManager from '@/components/management/ErrorManager.vue'
import { MPStyle } from '@tomvlk/ts-maniaplanet-formatter'

const minElo = ref(0)
const maxElo = ref(99999)
const minRank = ref(1)
const maxRank = ref(99999999)
const name = ref('')
const page = ref(1)
const computeMatchesPlayed = ref(false)

const {
  data: players,
  error,
  loading
} = APIClient.getPlayers(minElo, maxElo, minRank, maxRank, name, page, computeMatchesPlayed, {})
</script>

<template>
  <h2>Active players</h2>
  <span>Shows last active players matching your filters</span>
  <div class="w-100">
    <div class="d-flex gap-2 flex-wrap">
      <div>
        <label class="form-label">Min. rank</label>
        <select
          class="form-select form-select-sm"
          aria-label="Min-elo"
          @change="
            (e) => {
              minElo = parseInt(getEventValue(e))
              page = 1
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
              maxElo = parseInt(getEventValue(e))
              page = 1
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
              minRank = parseInt(getEventValue(e))
              page = 1
            }
          "
          type="number"
          min="1"
          max="9999999"
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
              maxRank = parseInt(getEventValue(e))
              page = 1
            }
          "
          type="number"
          min="1"
          max="9999999"
          value="9999999"
          class="form-check-input form-select-sm"
          style="width: 80px; height: 30px; margin-top: 0px"
        />
      </div>
      <div>
        <label class="form-label">Player name</label><br />
        <input
          @change="
            (e) => {
              name = getEventValue(e)
              page = 1
            }
          "
          type="text"
          placeholder="Enter player name..."
          class="form-check-input form-select-sm"
          style="width: 140px; height: 30px; margin-top: 0px"
        />
      </div>
      <div>
        <label class="form-label" for="displayMatchesPlayed"> Display matches played </label><br />
        <input
          class="form-check-input"
          style="width: 30px; height: 30px; margin-top: 0px"
          id="displayMatchesPlayed"
          type="checkbox"
          :checked="computeMatchesPlayed"
          v-on:change="() => (computeMatchesPlayed = !computeMatchesPlayed)"
        />
      </div>
      <div class="d-flex align-items-end justify-content-end flex-grow-1">
        <div class="d-flex gap-2 align-items-stretch">
          <div>
            <button
              class="btn btn-primary"
              :disabled="page === 1"
              @click="
                () => {
                  page = 1
                }
              "
            >
              <FontAwesomeIcon :icon="faBackwardFast" />
            </button>
          </div>
          <div>
            <button
              class="btn btn-primary"
              :disabled="page === 1"
              @click="
                () => {
                  page -= 1
                }
              "
            >
              <FontAwesomeIcon :icon="faBackward" />
            </button>
          </div>
          <div class="d-flex align-items-center">
            <div>
              <span>Page {{ page }}</span>
            </div>
          </div>
          <div>
            <button
              class="btn btn-primary"
              :disabled="players === null || players.length === 0"
              @click="
                () => {
                  page += 1
                }
              "
            >
              <FontAwesomeIcon :icon="faForward" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <ErrorManager :error="error">
      <template #body>
        <LoadingComponent v-if="loading" />
        <div class="w-100 overflow-x-auto" v-else>
          <table class="table table-striped table-sm w-100" data-toggle="table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Position</th>
                <th scope="col">Points</th>
                <th scope="col">Rank</th>
                <th scope="col">Activity</th>

                <template v-if="computeMatchesPlayed">
                  <th scope="col">Matches last 24h</th>
                  <th scope="col">Matches last week</th>
                  <th scope="col">Matches last month</th></template
                >
              </tr>
            </thead>
            <tbody>
              <tr v-if="!error" v-for="player in players" :key="player.uuid">
                <td>
                  <img alt="" class="player-flag" :src="`/flags/${player.country?.file_name}`" />
                  <span v-if="player.club_tag"
                    >[<span v-html="MPStyle(player.club_tag)"></span>]&nbsp;</span
                  >
                  <a :href="`/#/statistics/${player.uuid}`" target="_blank">
                    {{ player.name.length > 0 ? player.name : 'Unknown Player' }}</a
                  >
                </td>
                <td>{{ ordinalSuffixOf(player.rank) }}</td>
                <td>{{ player.points }}</td>
                <td>
                  <RankComponent :elo="player.points" :rank="player.rank" width="30px" />
                </td>
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
                <template v-if="computeMatchesPlayed">
                  <td>{{ player.games_last_24_hours }}</td>
                  <td>{{ player.games_last_week }}</td>
                  <td>{{ player.games_last_month }}</td></template
                >
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </ErrorManager>
  </div>
</template>
<style>
.player-flag {
  height: 20px;
  margin-right: 3px;
  vertical-align: middle;
}
</style>
