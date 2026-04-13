<template>
  <div class="col-lg-4 col-12 mb-2 align-items-stretch d-flex px-1">
    <div class="card w-100 d-flex flex-column">
      <ErrorManager :error="error">
        <template #body>
          <LoadingComponent v-if="loading || stats === null" />
          <div v-else>
            <div class="card-body row position-relative">
              <h5>General</h5>
              <div
                class="position-absolute"
                style="right: 10px; top: 5px; width: auto; font-size: 27px"
              >
                <RankComponent
                  v-if="stats.stats.rank.toString() !== 'N/A'"
                  :rank="stats.stats.rank"
                  :elo="stats.stats.points"
                  width="80px"
                />
              </div>
              <h6>
                Name:
                <a
                  class="player-label"
                  target="_blank"
                  :href="`https://trackmania.io/#/player/${stats.uuid}`"
                  ><span v-if="stats.club_tag">
                    [<span v-html="MPStyle(stats.club_tag)"></span>]&nbsp;</span
                  >
                  {{ stats.name }}</a
                >
              </h6>
              <h6>
                Position:
                <span class="player-label"
                  >{{ ordinalSuffixOf(stats.stats.rank) }}
                  <div v-if="isTimeFiltered" class="season-badge d-flex align-items-end pb-1 ms-1">
                    <span> ({{ stats.stats.season }})</span>
                  </div></span
                >
              </h6>
              <div class="d-flex justify-content-between">
                <h6>
                  Points:
                  <span class="player-label"
                    >{{ stats.stats.points }}
                    <div
                      v-if="isTimeFiltered"
                      class="season-badge d-flex align-items-end pb-1 ms-1"
                    >
                      <span> ({{ stats.stats.season }})</span>
                    </div></span
                  >
                </h6>
                <h6>
                  Matches played:
                  <span class="player-label justify-content-end">{{
                    stats.stats.total_played
                  }}</span>
                </h6>
              </div>
              <div class="d-flex justify-content-between">
                <h6>
                  Wins: <span class="player-label">{{ stats.stats.total_wins }}</span>
                </h6>
                <h6>
                  Win-rate:
                  <span class="player-label justify-content-end"
                    >{{
                      Math.round((stats.stats.total_wins * 100) / stats.stats.total_played)
                    }}
                    %</span
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
                    >{{
                      Math.round((stats.stats.total_mvp * 100) / stats.stats.total_played)
                    }}
                    %</span
                  >
                </h6>
              </div>
              <hr class="my-1" />
              <div class="d-flex justify-content-between">
                <h6>
                  Best win streak:
                  <span class="player-label">{{ stats.stats.most_wins_in_a_row }}</span>
                </h6>
                <h6>
                  Current streak:
                  <span class="player-label justify-content-end" :class="streakClass">{{
                    streakLabel
                  }}</span>
                </h6>
              </div>
              <h6>
                Worst loss streak:
                <span class="player-label">{{ stats.stats.most_losses_in_a_row }}</span>
              </h6>
            </div>
          </div></template
        ></ErrorManager
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import LoadingComponent from '@/components/basic/LoadingComponent.vue'
import { APIClient } from '@/api/client'
import RankComponent from '@/components/basic/RankComponent.vue'
import { ordinalSuffixOf, toTimestamp } from '@/utils'
import ErrorManager from '@/components/management/ErrorManager.vue'
import { renderMPStyle as MPStyle } from '@/utils'
import { computed } from 'vue'
import { type SeasonResult } from '@/api/entities'

const props = defineProps<{
  minDate: Date
  maxDate: Date
  player: string
  season?: SeasonResult | null
}>()

const isTimeFiltered = computed(() => {
  if (!props.season) return true
  return (
    !props.season.is_aggregated &&
    (toTimestamp(props.minDate) !== props.season.start_time ||
      toTimestamp(props.maxDate) !== props.season.end_time)
  )
})

const getVariables = () => {
  if (!props.season) {
    return { player: props.player, min_date: props.minDate, max_date: props.maxDate }
  }
  if (props.season.is_aggregated) {
    return { player: props.player, season: props.season.id }
  }
  const areSeasonDatesEqual =
    toTimestamp(props.minDate) === props.season.start_time &&
    toTimestamp(props.maxDate) == props.season.end_time
  if (areSeasonDatesEqual) {
    return { player: props.player, season: props.season.id }
  }
  return {
    player: props.player,
    min_date: props.minDate,
    max_date: props.maxDate
  }
}

const { data: stats, error, loading } = APIClient.getPlayerStatistics(getVariables)

const streakLabel = computed(() => {
  if (!stats.value) return ''
  const s = stats.value.stats.current_win_streak
  if (s > 0) return `+${s} W`
  if (s < 0) return `${s} L`
  return '0'
})

const streakClass = computed(() => {
  if (!stats.value) return ''
  const s = stats.value.stats.current_win_streak
  if (s > 0) return 'text-success'
  if (s < 0) return 'text-danger'
  return ''
})
</script>

<style scoped>
.player-label {
  font-size: 27px;
  display: flex;
}
.season-badge {
  font-size: 11px;
  font-weight: normal;
  color: var(--bs-secondary-color);
  vertical-align: middle;
}
</style>
