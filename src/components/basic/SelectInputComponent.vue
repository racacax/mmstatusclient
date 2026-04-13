<script setup lang="ts">
import DropdownComponent from '@/components/basic/DropdownComponent.vue'

defineProps<{
  label?: string
  options: { value: string; label: string }[]
  modelValue: string | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="d-flex flex-column">
    <label v-if="label" class="form-label fw-semibold mb-0">{{ label }}</label>
    <DropdownComponent
      class="filter-dropdown"
      :options="options"
      :model-value="modelValue"
      @update:model-value="emit('update:modelValue', $event)"
    />
  </div>
</template>
