<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faBackward, faBackwardFast, faForward } from '@fortawesome/free-solid-svg-icons'

const props = defineProps<{
  modelValue: number
  hasMore: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()
</script>

<template>
  <div class="d-flex align-items-end justify-content-end flex-grow-1">
    <div class="d-flex gap-2 align-items-stretch">
      <button
        class="btn btn-primary btn-sm"
        :disabled="modelValue === 1"
        @click="emit('update:modelValue', 1)"
      >
        <FontAwesomeIcon :icon="faBackwardFast" />
      </button>
      <button
        class="btn btn-primary btn-sm"
        :disabled="modelValue === 1"
        @click="emit('update:modelValue', modelValue - 1)"
      >
        <FontAwesomeIcon :icon="faBackward" />
      </button>
      <div class="d-flex align-items-center px-1">
        <span>Page {{ modelValue }}</span>
      </div>
      <button
        class="btn btn-primary btn-sm"
        :disabled="!hasMore"
        @click="emit('update:modelValue', modelValue + 1)"
      >
        <FontAwesomeIcon :icon="faForward" />
      </button>
    </div>
  </div>
</template>
