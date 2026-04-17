<script setup lang="ts">
import { ref, computed } from 'vue'
import { APIClient } from '@/api/client'
import { ranks } from '@/constants'
import LoadingComponent from '@/components/basic/LoadingComponent.vue'
import RankComponent from '@/components/basic/RankComponent.vue'
import ErrorManager from '@/components/management/ErrorManager.vue'
import RankFilterComponent from '@/components/basic/RankFilterComponent.vue'
import PageControlComponent from '@/components/basic/PageControlComponent.vue'

const minEloSelected = ref(0)
const maxEloSelected = ref(4000)
const page = ref(1)

const minElo = computed(() => minEloSelected.value)
const maxElo = computed(() => {
  const idx = ranks.findIndex((r) => r.minElo === maxEloSelected.value)
  return idx === 0 ? 99999 : ranks[idx - 1].minElo - 1
})

const { data: games, error, loading } = APIClient.getLastGames(minElo, maxElo, page, {})
</script>

<template>
  <h2>Last matches</h2>
  <span>Shows the last matches matching your filters</span>
  <div class="w-100">
    <div class="d-flex gap-2 flex-wrap">
      <RankFilterComponent
        v-model="minEloSelected"
        label="Min. rank"
        @update:model-value="page = 1"
      />
      <RankFilterComponent
        v-model="maxEloSelected"
        label="Max. rank"
        :default-value="4000"
        @update:model-value="page = 1"
      />
      <PageControlComponent
        :model-value="page"
        :has-more="games !== null && games.length > 0"
        @update:model-value="page = $event"
      />
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
                  <RouterLink :to="`/match/${game.id}`">{{ game.id }}</RouterLink>
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
                  <a :href="`/#/match/${game.id}`" target="_blank">Active</a>
                </td>
                <td v-else>
                  <a :href="`/#/match/${game.id}`" target="_blank">Completed</a>
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
