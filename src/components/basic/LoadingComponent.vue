<template>
  <div class="w-100 d-flex justify-content-center align-items-center loading">
    <div class="loading-label d-flex align-items-center gap-2">
      <img :src="`/loading/${randomGif}`" alt="loading icon" class="loading-icon" /><span>
        Loading...</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { randomItem } from '@/utils'

const randomGif = ref(
  randomItem(['owoWiggle.gif', 'fdding.gif', 'donkPis.gif', 'xddSnake.gif', 'alienPls.gif'])
)
</script>

<style scoped>
.loading {
  height: 400px;
}
.loading-label {
  font-size: 20pt;
}
.loading-icon {
  max-width: 60px;
  max-height: 60px;
  width: auto;
}
</style>
