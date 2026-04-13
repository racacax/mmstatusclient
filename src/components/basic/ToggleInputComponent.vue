<script setup lang="ts">
defineProps<{
  label: string
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <div class="d-flex flex-column">
    <label class="form-label fw-semibold mb-0">{{ label }}</label>
    <button
      type="button"
      class="btn btn-sm border h-100"
      :class="modelValue ? 'btn-primary' : 'btn-outline-primary'"
      @click="emit('update:modelValue', !modelValue)"
    >
      {{ modelValue ? 'Yes' : 'No' }}
    </button>
  </div>
</template>
