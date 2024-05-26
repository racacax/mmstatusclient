<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'

const props = defineProps<{
  error: string | null
}>()
</script>
<template>
  <slot name="body" v-if="props.error === null"></slot>
  <div v-else class="d-flex justify-content-center align-items-center pt-5">
    <strong class="text-danger"><FontAwesomeIcon :icon="faExclamationCircle" /> {{ error }}</strong>
  </div>
</template>
<style scoped></style>
