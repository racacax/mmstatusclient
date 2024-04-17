<template>
  <img :style="`width: ${width}`" :src="`/images/${image}`" :alt="`${name} image`" /> {{ name }}
</template>

<script setup lang="ts">
import { ranks } from '@/constants.ts'
import { ref } from 'vue'

const props = defineProps({
  elo: Number,
  rank: Number,
  width: String
})

const image = ref('')
const name = ref('')

for (let i = 0; i < ranks.length; i++) {
  const rankObj = ranks[i]
  if ((rankObj.minRank !== null && props.rank > rankObj.minRank) || rankObj.minElo > props.elo) {
    continue
  }
  image.value = rankObj.image
  name.value = rankObj.name
  break
}
</script>

<style scoped></style>
