<template>
  <CardComponent
    title="Active matches per rank"
    tooltip="List of currently ongoing matches classified per rank. Match is counted if at least one player has the corresponding rank."
    classes="col-12"
  >
    <template #main>
      <ErrorManager :error="error">
        <template #body>
          <LoadingComponent v-if="loading || data === null" />
          <div v-else class="row g-1 mt-1 overflow-hidden w-100">
            <div
              v-for="entry in data.results"
              :key="entry.rank"
              :class="entry.rank === 'tm' ? 'col-12 d-flex' : 'col-12 col-md-6 col-lg-4 d-flex'"
            >
              <div
                class="rank-tile d-flex flex-row align-items-center w-100 px-2 py-1 rounded border gap-2"
              >
                <img
                  :src="`/images/${rankImage(entry.rank)}`"
                  :alt="entry.name"
                  class="rank-img flex-shrink-0"
                />
                <span class="rank-name small text-muted flex-grow-1">{{ entry.name }}</span>
                <span class="rank-count fw-bold">{{ entry.count }}</span>
              </div>
            </div>
          </div>
        </template>
      </ErrorManager>
    </template>
  </CardComponent>
</template>

<script setup lang="ts">
import { APIClient } from '@/api/client'
import { ranks } from '@/constants'
import CardComponent from '@/components/basic/CardComponent.vue'
import LoadingComponent from '@/components/basic/LoadingComponent.vue'
import ErrorManager from '@/components/management/ErrorManager.vue'

const { data, error, loading } = APIClient.getActiveMatchesPerRank()

function rankImage(rankKey: string): string {
  const found = ranks.find((r) => r.key === rankKey)
  return found ? found.image : ''
}
</script>

<style scoped>
.rank-img {
  width: 28px;
  height: 28px;
  object-fit: contain;
}
</style>
