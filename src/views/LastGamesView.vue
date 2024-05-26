<script setup lang="ts">
import { ref } from 'vue'
import { APIClient } from '@/api/client'
import LoadingComponent from '@/components/LoadingComponent.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faBackward, faBackwardFast, faForward } from '@fortawesome/free-solid-svg-icons'
import RankComponent from '@/components/RankComponent.vue'
import { getEventValue } from '@/utils'
import ErrorManager from '@/components/management/ErrorManager.vue'

const minElo = ref(0)
const maxElo = ref(99999)
const page = ref(1)
const { data: games, error, loading } = APIClient.getLastGames(minElo, maxElo, page, {})
</script>

<template>
  <h2>Last matches</h2>
  <span>Shows the last matches matching your filters</span>
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
              :disabled="games === null || games.length === 0"
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
                <th scope="col">ID</th>
                <th scope="col">Map name</th>
                <th scope="col">Avg. rank</th>
                <th scope="col">Min. rank</th>
                <th scope="col">Max. rank</th>
                <th scope="col">Status</th>
                <th scope="col">Started on</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="game in games" :key="game.id">
                <td>
                  <a :href="`https://trackmania.io/#/match/${game.id}`" target="_blank">{{
                    game.id
                  }}</a>
                </td>
                <td>
                  <a
                    :href="`https://trackmania.io/#/leaderboard/${game.map.uid}`"
                    target="_blank"
                    >{{ game.map.name }}</a
                  >
                </td>
                <td>
                  <RankComponent
                    :rank="game.trackmaster_points_limit <= game.average_elo ? 1 : 11"
                    :elo="game.average_elo"
                    width="30px"
                  />
                  ({{ game.average_elo }} pts)
                </td>
                <td>
                  <RankComponent
                    :rank="game.trackmaster_points_limit <= game.min_elo ? 1 : 11"
                    :elo="game.min_elo"
                    width="30px"
                  />
                  ({{ game.min_elo }} pts)
                </td>
                <td>
                  <RankComponent
                    :rank="game.trackmaster_points_limit <= game.max_elo ? 1 : 11"
                    :elo="game.max_elo"
                    width="30px"
                  />
                  ({{ game.max_elo }} pts)
                </td>
                <td v-if="!game.is_finished">
                  <a :href="`https://trackmania.io/#/match/${game.id}`" target="_blank">Active</a>
                </td>
                <td v-else>
                  <a :href="`https://trackmania.io/#/match/${game.id}`" target="_blank"
                    >Completed</a
                  >
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
    </ErrorManager>
  </div>
</template>
