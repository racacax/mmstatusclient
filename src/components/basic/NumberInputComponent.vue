<script setup lang="ts">
defineProps<{
  label?: string
  modelValue: number
  min?: number
  max?: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()
</script>

<template>
  <div class="d-flex flex-column">
    <label v-if="label" class="form-label fw-semibold mb-0">{{ label }}</label>
    <input
      type="number"
      class="filter-input"
      style="min-width: 80px; max-width: 120px"
      :value="modelValue"
      :min="min"
      :max="max"
      @change="emit('update:modelValue', parseInt(($event.target as HTMLInputElement).value))"
    />
  </div>
</template>

<style>
.filter-input {
  padding: 0.4rem 0.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
  border: 1px solid var(--bs-border-color);
  border-radius: var(--bs-border-radius-sm);
  background-color: var(--bs-body-bg);
  color: var(--bs-body-color);
  min-width: 80px;
  max-width: 120px;
  flex: 1;
}
.filter-input:focus {
  outline: none;
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.25);
}
</style>
