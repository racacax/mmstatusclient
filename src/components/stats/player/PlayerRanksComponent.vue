<template>
  <CardComponent
    classes="col-lg-6 col-12"
    title="Player rank evolution"
    tooltip="Note: Before April 28th, data are not available."
  >
    <template #filters>
      <div style="height: 40px"></div>
    </template>
    <template #main>
      <ErrorManager :error="error">
        <template #body>
          <LoadingComponent v-if="loading || data === null" />
          <template v-else>
            <LineChartComponent
              label="Rank"
              :reverse="true"
              :data="data.results.map((entry) => [entry.time * 1000, entry.rank])"
            />
            <div class="w-100 d-flex justify-content-center" v-if="data.results.length === 0">
              <span>No data to display</span>
            </div>
          </template>
        </template>
      </ErrorManager>
    </template>
  </CardComponent>
</template>

<script setup lang="ts">
import LoadingComponent from '@/components/basic/LoadingComponent.vue'
import { toRef } from 'vue'
import { APIClient } from '@/api/client'
import CardComponent from '@/components/basic/CardComponent.vue'
import LineChartComponent from '@/components/charts/LineChartComponent.vue'
import ErrorManager from '@/components/management/ErrorManager.vue'

const props = defineProps<{
  minDate: Date
  maxDate: Date
  player: string
}>()

const { data, error, loading } = APIClient.getPlayerRanks(
  toRef(props, 'minDate'),
  toRef(props, 'maxDate'),
  toRef(props, 'player')
)
</script>
