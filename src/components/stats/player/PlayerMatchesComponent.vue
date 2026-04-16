<template>
  <CardComponent
    classes="col-12"
    title="Match history"
    tooltip="Last matches played by the player in the selected period, ordered most recent first."
  >
    <template #filters>
      <PageControlComponent
        :model-value="page"
        :has-more="data !== null && data.results.length === 10"
        @update:model-value="page = $event"
      />
    </template>
    <template #main>
      <ErrorManager :error="error">
        <template #body>
          <LoadingComponent v-if="loading || data === null" />
          <div v-else>
            <div class="w-100 overflow-x-auto">
              <table class="table table-striped table-sm w-100">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Map</th>
                    <th>Avg. rank</th>
                    <th>Result</th>
                    <th>MVP</th>
                    <th>Rank after</th>
                    <th>Elo Δ</th>
                    <th>Played at</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(match, i) in data.results" :key="match.id">
                    <td>
                      <RouterLink :to="`/match/${match.id}`">{{ match.id }}</RouterLink>
                    </td>
                    <td>
                      <a
                        :href="`https://trackmania.io/#/leaderboard/${match.map_uid}`"
                        target="_blank"
                      >
                        {{ match.map_name }}
                      </a>
                    </td>
                    <td>
                      <RankComponent :rank="null" :elo="match.average_elo" width="30px" />
                      ({{ match.average_elo }} pts)
                    </td>
                    <td>
                      <span
                        v-if="match.is_finished"
                        :class="
                          match.is_win ? 'text-success fw-semibold' : 'text-danger fw-semibold'
                        "
                      >
                        {{ match.is_win ? 'Win' : 'Loss' }}
                      </span>
                      <span v-else class="text-muted">—</span>
                    </td>
                    <td>
                      <span v-if="match.is_mvp" class="text-warning fw-semibold">MVP</span>
                      <span v-else class="text-muted">—</span>
                    </td>
                    <td>
                      <template v-if="match.is_finished">
                        <RankComponent :rank="null" :elo="match.points_after_match" width="25px" />
                        ({{ match.points_after_match }} pts)
                      </template>
                      <span v-else class="text-muted">—</span>
                    </td>
                    <td>
                      <span
                        v-if="match.is_finished && i < data.results.length - 1"
                        :class="eloDeltaClass(i)"
                      >
                        {{ eloDeltaLabel(i) }}
                      </span>
                      <span v-else class="text-muted">—</span>
                    </td>
                    <td style="white-space: nowrap">
                      {{ new Date(match.time * 1000).toLocaleDateString() }}
                      {{ new Date(match.time * 1000).toTimeString().split(' ')[0] }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="w-100 d-flex justify-content-center" v-if="data.results.length === 0">
              <span>No matches to display</span>
            </div>
          </div>
        </template>
      </ErrorManager>
    </template>
  </CardComponent>
</template>

<script setup lang="ts">
import { ref, toRef, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { APIClient } from '@/api/client'
import CardComponent from '@/components/basic/CardComponent.vue'
import LoadingComponent from '@/components/basic/LoadingComponent.vue'
import ErrorManager from '@/components/management/ErrorManager.vue'
import RankComponent from '@/components/basic/RankComponent.vue'
import PageControlComponent from '@/components/basic/PageControlComponent.vue'
import { ordinalSuffixOf } from '@/utils'

const props = defineProps<{
  minDate: Date
  maxDate: Date
  player: string
}>()

const page = ref(1)

watch([() => props.player, () => props.minDate, () => props.maxDate], () => {
  page.value = 1
})

const { data, error, loading } = APIClient.getPlayerMatches(
  toRef(props, 'minDate'),
  toRef(props, 'maxDate'),
  toRef(props, 'player'),
  page
)

function eloDelta(i: number): number {
  return data.value!.results[i].points_after_match - data.value!.results[i + 1].points_after_match
}

function eloDeltaLabel(i: number): string {
  const d = eloDelta(i)
  return d >= 0 ? `+${d}` : `${d}`
}

function eloDeltaClass(i: number): string {
  const d = eloDelta(i)
  return d > 0 ? 'text-success fw-semibold' : d < 0 ? 'text-danger fw-semibold' : 'text-muted'
}
</script>
