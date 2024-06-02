<script setup lang="ts">
import { getRenderedRank } from '@/utils'
defineProps<{ rank: number | null; elo: number; width: string }>()
</script>

<template>
  <div class="d-inline-block" v-html="getRenderedRank(elo, rank, width)"></div>
</template>

<style scoped></style>
