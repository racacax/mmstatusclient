<template>
  <div class="col-12 col-lg-6 px-1 align-items-stretch d-flex mb-2">
    <div class="card p-2 pt-3 w-100 d-flex flex-column justify-content-around">
      <div class="d-flex justify-content-between">
        <h5>Maps</h5>
      </div>
      <div class="table-max w-100">
        <ErrorManager :error="error">
          <template #body>
            <LoadingComponent v-if="loading" />
            <table class="table table-striped table-sm" data-toggle="table" v-else>
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col">Map</th>
                  <th scope="col">Total matches</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(stat, i) in stats?.results" :key="i">
                  <td>{{ i + 1 }}</td>
                  <td>
                    <a
                      target="_blank"
                      :href="`https://trackmania.io/#/leaderboard/${stat.map_uid}`"
                      >{{ stat.map_name }}</a
                    >
                  </td>
                  <td>{{ stat.total_played }}</td>
                </tr>
              </tbody>
            </table></template
          ></ErrorManager
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoadingComponent from '@/components/basic/LoadingComponent.vue'
import { ref, watch } from 'vue'
import { APIClient } from '@/api/client'
import ErrorManager from '@/components/management/ErrorManager.vue'

const props = defineProps({
  season: { type: Number, required: true }
})
const seasonRef = ref(props.season)
const { data: stats, error, loading } = APIClient.getMapsStatistics(seasonRef)
const updateRefs = () => {
  seasonRef.value = props.season
}
watch(() => [props.season], updateRefs)
</script>

<style scoped>
.table-max {
  max-height: 400px;
  overflow-y: scroll;
}
</style>
