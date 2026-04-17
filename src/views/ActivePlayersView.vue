<script setup lang="ts">
import { ref, computed } from 'vue'
import { ordinalSuffixOf } from '@/utils'
import { ranks } from '@/constants'
import { APIClient } from '@/api/client'
import LoadingComponent from '@/components/basic/LoadingComponent.vue'
import RankComponent from '@/components/basic/RankComponent.vue'
import ErrorManager from '@/components/management/ErrorManager.vue'
import { renderMPStyle as MPStyle } from '@/utils'
import RankFilterComponent from '@/components/basic/RankFilterComponent.vue'
import NumberInputComponent from '@/components/basic/NumberInputComponent.vue'
import TextInputComponent from '@/components/basic/TextInputComponent.vue'
import ToggleInputComponent from '@/components/basic/ToggleInputComponent.vue'
import PageControlComponent from '@/components/basic/PageControlComponent.vue'

const minEloSelected = ref(0)
const maxEloSelected = ref(4000)
const minRank = ref(1)
const maxRank = ref(99999999)
const name = ref('')
const page = ref(1)
const computeMatchesPlayed = ref(false)

function setMinRank(val: number) {
  minRank.value = val
  page.value = 1
}
function setMaxRank(val: number) {
  maxRank.value = val
  page.value = 1
}
function setName(val: string) {
  name.value = val
  page.value = 1
}

const minElo = computed(() => minEloSelected.value)
const maxElo = computed(() => {
  const idx = ranks.findIndex((r) => r.minElo === maxEloSelected.value)
  return idx === 0 ? 99999 : ranks[idx - 1].minElo - 1
})

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
      <NumberInputComponent
        label="Min. position"
        :model-value="minRank"
        :min="1"
        :max="9999999"
        @update:model-value="setMinRank"
      />
      <NumberInputComponent
        label="Max. position"
        :model-value="maxRank"
        :min="1"
        :max="9999999"
        @update:model-value="setMaxRank"
      />
      <TextInputComponent
        label="Player name"
        :model-value="name"
        min-width="160px"
        placeholder="Enter player name..."
        :lazy="true"
        @update:model-value="setName"
      />
      <ToggleInputComponent
        label="Display matches played"
        :model-value="computeMatchesPlayed"
        @update:model-value="computeMatchesPlayed = $event"
      />
      <PageControlComponent
        :model-value="page"
        :has-more="players !== null && players.length > 0"
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
              <template v-if="!error">
                <tr v-for="player in players" :key="player.uuid">
                  <td>
                    <img alt="" class="player-flag" :src="`/flags/${player.country?.file_name}`" />
                    <span v-if="player.club_tag"
                      >[<span v-html="MPStyle(player.club_tag)"></span>]&nbsp;</span
                    >
                    <a :href="`/#/player-statistics/${player.uuid}`" target="_blank">
                      {{ player.name.length > 0 ? player.name : 'Unknown Player' }}</a
                    >
                  </td>
                  <td>{{ ordinalSuffixOf(player.rank) }}</td>
                  <td>{{ player.points }}</td>
                  <td>
                    <RankComponent :elo="player.points" :rank="player.rank" width="30px" />
                  </td>
                  <td v-if="!player.last_game_finished">
                    <a :href="`/#/match/${player.last_game_id}`" target="_blank">In match</a>
                  </td>
                  <td v-else>
                    <a :href="`/#/match/${player.last_game_id}`" target="_blank"
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
              </template>
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
