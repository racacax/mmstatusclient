<template>
  <div class="col-lg-4 col-12 mb-2 align-items-stretch d-flex px-1">
    <div class="card w-100 d-flex flex-column">
      <LoadingComponent v-if="stats === null" />
      <div v-else>
        <div class="card-body row position-relative">
          <h5>General</h5>
          <div
            class="position-absolute"
            style="right: 10px; top: 5px; width: auto; font-size: 27px"
          >
            <RankComponent :rank="stats.stats.rank" :elo="stats.stats.points" width="80px" />
          </div>
          <h6>
            Name:
            <a
              class="player-label"
              target="_blank"
              :href="`https://trackmania.io/#/player/${stats.uuid}`"
              >{{ stats.name }}</a
            >
          </h6>
          <h6>
            Position: <span class="player-label">{{ ordinalSuffixOf(stats.stats.rank) }}</span>
          </h6>
          <div class="d-flex justify-content-between">
            <h6>
              Points: <span class="player-label">{{ stats.stats.points }}</span>
            </h6>
            <h6>
              Matches played:
              <span class="player-label justify-content-end">{{ stats.stats.total_played }}</span>
            </h6>
          </div>
          <div class="d-flex justify-content-between">
            <h6>
              Wins: <span class="player-label">{{ stats.stats.total_wins }}</span>
            </h6>
            <h6>
              Win-rate:
              <span class="player-label justify-content-end"
                >{{ Math.round((stats.stats.total_wins * 100) / stats.stats.total_played) }} %</span
              >
            </h6>
          </div>
          <div class="d-flex justify-content-between">
            <h6>
              Losses: <span class="player-label">{{ stats.stats.total_losses }}</span>
            </h6>
            <h6>
              Loss-rate:
              <span class="player-label justify-content-end"
                >{{
                  Math.round((stats.stats.total_losses * 100) / stats.stats.total_played)
                }}
                %</span
              >
            </h6>
          </div>
          <div class="d-flex justify-content-between">
            <h6>
              MVP: <span class="player-label">{{ stats.stats.total_mvp }}</span>
            </h6>
            <h6>
              MVP-rate:
              <span class="player-label justify-content-end"
                >{{ Math.round((stats.stats.total_mvp * 100) / stats.stats.total_played) }} %</span
              >
            </h6>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoadingComponent from '@/components/LoadingComponent.vue'
import { ref, type Ref, watch } from 'vue'
import { type PlayerStatistics } from '@/api/entities'
import { APIClient } from '@/api/client'
import RankComponent from '@/components/RankComponent.vue'
import { ordinalSuffixOf } from '../utils'

const props = defineProps({
  minDate: { type: Date, required: true },
  maxDate: { type: Date, required: true },
  player: { type: String, required: true }
})

const stats: Ref<PlayerStatistics | null> = ref(null)

function fetchStats() {
  stats.value = null
  APIClient.getPlayerStatistics(props.minDate, props.maxDate, props.player).then((j) => {
    stats.value = j
  })
}
fetchStats()
watch(() => [props.player, props.maxDate, props.minDate], fetchStats)
</script>

<style scoped>
.player-label {
  font-size: 27px;
  display: flex;
}
</style>
