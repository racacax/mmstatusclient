<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { APIClient } from '@/api/client'
import LoadingComponent from '@/components/basic/LoadingComponent.vue'
import ErrorManager from '@/components/management/ErrorManager.vue'
import RankComponent from '@/components/basic/RankComponent.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faStar, faRobot } from '@fortawesome/free-solid-svg-icons'
import type { MatchDetailPlayer } from '@/api/entities'

const route = useRoute()
const matchId = ref(parseInt(route.params.matchId as string))

const { data: match, error, loading } = APIClient.getMatch(matchId)

const winners = computed<MatchDetailPlayer[]>(
  () => match.value?.players.filter((p) => p.is_win) ?? []
)
const losers = computed<MatchDetailPlayer[]>(
  () => match.value?.players.filter((p) => !p.is_win) ?? []
)
const isBotMatch = computed(
  () => match.value !== null && match.value.is_finished && losers.value.length === 0
)

function eloGainedClass(gained: number | null): string {
  if (gained === null) return ''
  return gained > 0 ? 'text-success' : gained < 0 ? 'text-danger' : ''
}

function formatEloGained(gained: number | null): string {
  if (gained === null) return '—'
  return gained > 0 ? `+${gained}` : `${gained}`
}
</script>

<template>
  <ErrorManager :error="error">
    <template #body>
      <LoadingComponent v-if="loading" />
      <div v-else-if="match">
        <div class="d-flex align-items-baseline gap-2 flex-wrap mb-2">
          <h2 class="mb-0">Match #{{ match.id }}</h2>
          <span class="badge fs-6" :class="match.is_finished ? 'bg-secondary' : 'bg-success'">
            {{ match.is_finished ? 'Finished' : 'In progress' }}
          </span>
        </div>
        <div class="d-flex gap-4 flex-wrap mb-4" style="font-size: 0.95rem">
          <span>
            Map:
            <a
              :href="`https://trackmania.io/#/leaderboard/${match.map.uid}`"
              target="_blank"
              class="fw-semibold"
            >
              {{ match.map.name }}
            </a>
          </span>
          <span class="text-secondary">{{ new Date(match.time * 1000).toLocaleString() }}</span>
          <span
            >Avg ELO: <strong>{{ match.average_elo }}</strong></span
          >
          <span
            >Range: <strong>{{ match.min_elo }} – {{ match.max_elo }}</strong></span
          >
          <span v-if="match.rounds !== null"
            >Rounds: <strong>{{ match.rounds }}</strong></span
          >
          <a :href="`https://trackmania.io/#/match/${match.id}`" target="_blank">View on TM.io</a>
        </div>

        <div class="row gx-3">
          <div class="col-12 col-lg-6 mb-3">
            <div class="card h-100 border-success">
              <div class="card-header text-success fw-bold fs-5">
                {{ isBotMatch ? 'Players' : match.is_finished ? 'Winners' : 'Team' }}
              </div>
              <div class="card-body p-0">
                <table class="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Player</th>
                      <th v-if="match.is_finished">Score</th>
                      <th>ELO</th>
                      <th v-if="match.is_finished">Rank</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="p in isBotMatch
                        ? winners
                        : match.is_finished
                          ? winners
                          : match.players"
                      :key="p.uuid"
                    >
                      <td class="align-middle">
                        <FontAwesomeIcon
                          v-if="p.is_mvp"
                          :icon="faStar"
                          class="text-warning me-1"
                          title="MVP"
                        />
                        <a :href="`/#/player-statistics/${p.uuid}`" class="fw-semibold">{{
                          p.name
                        }}</a>
                      </td>
                      <td v-if="match.is_finished" class="align-middle">{{ p.score ?? '—' }}</td>
                      <td class="align-middle">
                        <span>{{ p.elo_before }}</span>
                        <template v-if="p.elo_after !== null">
                          <span class="text-secondary"> → {{ p.elo_after }}</span>
                          <span :class="eloGainedClass(p.elo_gained)" class="ms-1 fw-semibold"
                            >({{ formatEloGained(p.elo_gained) }})</span
                          >
                        </template>
                      </td>
                      <td v-if="match.is_finished" class="align-middle">
                        <RankComponent
                          v-if="p.elo_after !== null"
                          :elo="p.elo_after"
                          :rank="p.rank_after"
                          width="30px"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="col-12 col-lg-6 mb-3" v-if="match.is_finished">
            <div class="card h-100" :class="isBotMatch ? 'border-secondary' : 'border-danger'">
              <div
                class="card-header fw-bold fs-5"
                :class="isBotMatch ? 'text-secondary' : 'text-danger'"
              >
                {{ isBotMatch ? 'Opponents' : 'Losers' }}
              </div>
              <div
                class="card-body"
                :class="isBotMatch ? 'd-flex align-items-center justify-content-center' : 'p-0'"
              >
                <div v-if="isBotMatch" class="text-center text-secondary py-4">
                  <FontAwesomeIcon :icon="faRobot" style="font-size: 3rem" />
                  <div class="mt-2 fs-5">Bots</div>
                </div>
                <table v-else class="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Player</th>
                      <th>Score</th>
                      <th>ELO</th>
                      <th>Rank</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="p in losers" :key="p.uuid">
                      <td class="align-middle">
                        <FontAwesomeIcon
                          v-if="p.is_mvp"
                          :icon="faStar"
                          class="text-warning me-1"
                          title="MVP"
                        />
                        <a :href="`/#/player-statistics/${p.uuid}`" class="fw-semibold">{{
                          p.name
                        }}</a>
                      </td>
                      <td class="align-middle">{{ p.score ?? '—' }}</td>
                      <td class="align-middle">
                        <span>{{ p.elo_before }}</span>
                        <template v-if="p.elo_after !== null">
                          <span class="text-secondary"> → {{ p.elo_after }}</span>
                          <span :class="eloGainedClass(p.elo_gained)" class="ms-1 fw-semibold"
                            >({{ formatEloGained(p.elo_gained) }})</span
                          >
                        </template>
                      </td>
                      <td class="align-middle">
                        <RankComponent
                          v-if="p.elo_after !== null"
                          :elo="p.elo_after"
                          :rank="p.rank_after"
                          width="30px"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </ErrorManager>
</template>
