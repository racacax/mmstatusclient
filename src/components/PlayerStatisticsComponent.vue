<template>
  <div class="mb-2 d-flex col-lg-5 col-12 flex-column">
    <LoadingComponent v-if="stats === null" />
    <div v-else>
      <div>
        <div class="card">
          <div class="card-body row position-relative">
            <h5>General</h5>
            <div class="position-absolute" style="right: 10px; top: 5px; width: auto">
              <RankComponent :rank="stats.stats.rank" :elo="stats.stats.points" width="60px" />
            </div>
            <h6>
              Name:
              <a target="_blank" :href="`https://trackmania.io/#/player/${stats.uuid}`">{{
                stats.name
              }}</a>
            </h6>
            <h6>Position: {{ ordinalSuffixOf(stats.stats.rank) }}</h6>
            <div class="d-flex justify-content-between">
              <h6>Points: {{ stats.stats.points }}</h6>
              <h6>Matches played: {{ stats.stats.total_played }}</h6>
            </div>
            <div class="d-flex justify-content-between">
              <h6>Wins: {{ stats.stats.total_wins }}</h6>
              <h6>
                Win-rate:
                {{ Math.round((stats.stats.total_wins * 100) / stats.stats.total_played) }} %
              </h6>
            </div>
            <div class="d-flex justify-content-between">
              <h6>Losses: {{ stats.stats.total_losses }}</h6>
              <h6>
                Loss-rate:
                {{ Math.round((stats.stats.total_losses * 100) / stats.stats.total_played) }} %
              </h6>
            </div>
            <div class="d-flex justify-content-between">
              <h6>MVP: {{ stats.stats.total_mvp }}</h6>
              <h6>
                MVP-rate:
                {{ Math.round((stats.stats.total_mvp * 100) / stats.stats.total_played) }} %
              </h6>
            </div>
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
  minDate: Date,
  maxDate: Date,
  player: String
})

const stats: Ref<PlayerStatistics | null> = ref(null)

function fetchStats() {
  stats.value = null
  if (props.minDate === undefined || props.maxDate === undefined || props.player === undefined) {
    return
  }
  APIClient.getPlayerStatistics(props.minDate, props.maxDate, props.player).then((j) => {
    stats.value = j
  })
}
fetchStats()
watch(() => [props.player, props.maxDate, props.minDate], fetchStats)
</script>

<style scoped></style>
