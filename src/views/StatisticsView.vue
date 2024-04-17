<script setup lang="ts">
import GlobalStatisticsComponent from '@/components/GlobalStatisticsComponent.vue'
import { type Ref, ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { APIClient } from '@/api/client'
import { type SearchPlayer } from '@/api/entities'
import PlayerStatisticsComponent from '@/components/PlayerStatisticsComponent.vue'
import PlayerMapStatisticsComponent from '@/components/PlayerMapStatisticsComponent.vue'
import PlayerOpponentsStatisticsComponent from '@/components/PlayerOpponentsStatisticsComponent.vue'
import {useRoute} from "vue-router";
import {getLocalDate} from "@/utils";

const minDate = ref(new Date(2024,3,4))
const maxDate = ref(new Date())
const route = useRoute()
const searchString: Ref<HTMLInputElement | null> = ref(null)
const currentPlayer: Ref<string | null> = ref(route.params?.playerId?.toString())
const listPlayers: Ref<SearchPlayer | null> = ref(null)
const searchBtn = ref();
const minDateInput = ref();
const maxDateInput = ref();
function fetchPlayers() {
  listPlayers.value = null
  if (searchString.value === null) {
    return
  }
  searchBtn.value.disabled = "disabled"
  APIClient.searchPlayer(searchString.value.value).then((r) => {listPlayers.value = r; searchBtn.value.disabled = "";})
}
</script>

<template>
  <h2>Statistics</h2>
  <span
    >Shows different statistics for current matchmaking season.
    <span style="color: #c90b0b"
      >Note : Statistics are gathered from April 4th. First 3-4 days of matchmaking are not counted
      (at least for now).</span
    ></span
  ><br/>

  <div>
    <span>Statistics between </span
    ><input
      class="form-check-input rounded-1 datetime"
      type="datetime-local"
      ref="minDateInput"
      :value="getLocalDate(minDate)"
      min="2024-04-03T00:00"
      :max="getLocalDate(maxDate)"
  />
    <span> and </span>
    <input
        class="form-check-input rounded-1 datetime"
        ref="maxDateInput"
        type="datetime-local"
        :value="getLocalDate(maxDate)"
        :min="getLocalDate(minDate)"
    />
    <div type="button" class="btn btn-primary mx-1" @click="(e) =>  {
      minDate = new Date(minDateInput.value)
      maxDate = new Date(maxDateInput.value)
    }">
      <FontAwesomeIcon :icon="faSearch" /> Search
    </div>
  </div>
  <div class="row w-100 mt-2">
    <div class="col-lg-4 col-md-6 col-12">
      <h4>Global statistics</h4>
      <GlobalStatisticsComponent :min-date="minDate" :max-date="maxDate" />
    </div>
    <div class="col-lg-8 col-md-6 col-12">
      <h4>Player statistics</h4>
      <form class="d-flex gap-2" method="dialog">
        <input
          type="text"
          class="form-check-input form-select-sm"
          ref="searchString"
          placeholder="Enter player name..."
          style="width: 150px; height: 45px"
        />
        <button
          type="submit"
          ref="searchBtn"
          @click="
            (e) => {
              fetchPlayers()
            }
          "
          class="btn btn-primary"
        >
          <FontAwesomeIcon :icon="faSearch" /> Search
        </button>
      </form>
      <div v-if="listPlayers !== null">
        <div v-if="listPlayers.results.length === 0" style="color: #c90b0b">
          No player matching query
        </div>
        <table>
          <tr
            class="d-flex w-100 justify-content-between"
            style="max-width: 250px"
            v-for="player in listPlayers.results"
            :key="player.key"
          >
            <td>{{ player.name }}&nbsp;</td>
            <td>
              <RouterLink :to="`/statistics/${player.uuid}`"
                style="cursor: pointer"
                          @click="
                  () => {
                    currentPlayer = player.uuid
                    listPlayers = null
                  }
                "
                class="text-decoration-underline"
                >Choose</RouterLink
              >
            </td>
          </tr>
        </table>
      </div>
      <div
        v-if="currentPlayer === null || currentPlayer === undefined"
        class="w-100 d-flex justify-content-center align-items-center"
        style="height: 150px"
      >
        <span>Search a player to show statistics</span>
      </div>
      <div v-else class="row mt-2">
        <PlayerStatisticsComponent
          :min-date="minDate"
          :max-date="maxDate"
          :player="currentPlayer"
        />
        <PlayerMapStatisticsComponent
          :min-date="minDate"
          :max-date="maxDate"
          :player="currentPlayer"
        />
        <PlayerOpponentsStatisticsComponent
          :min-date="minDate"
          :max-date="maxDate"
          :player="currentPlayer"
        />
      </div>
    </div>
  </div>
</template>
<style scoped type="text/css">

.datetime {
  width: 180px;
  height: 38px;
  margin-top: 0;
}

</style>
