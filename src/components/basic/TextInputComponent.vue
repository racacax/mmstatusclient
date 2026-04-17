<script setup lang="ts">
defineProps<{
  label?: string
  modelValue: string
  placeholder?: string
  minWidth?: string
  lazy?: boolean
  labelStyle?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onEvent(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="d-flex flex-column">
    <label v-if="label" class="form-label fw-semibold mb-0" :style="labelStyle">{{ label }}</label>
    <input
      type="text"
      class="filter-input"
      :style="minWidth ? { minWidth } : undefined"
      :value="modelValue"
      :placeholder="placeholder"
      v-bind="
        lazy
          ? { onChange: onEvent, onKeyup: (e: KeyboardEvent) => e.key === 'Enter' && onEvent(e) }
          : { onInput: onEvent }
      "
    />
  </div>
</template>
