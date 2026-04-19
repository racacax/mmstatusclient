<script setup lang="ts" generic="T extends string | number">
import { computed } from 'vue'

const props = defineProps<{
  options: { value: T; label: string; detail?: string; icon?: string }[]
  modelValue: T | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: T]
}>()

const selectedOption = computed(
  () => props.options.find((o) => o.value === props.modelValue) ?? null
)
</script>

<template>
  <div class="dropdown">
    <button
      class="btn btn-outline-primary border btn-sm dropdown-toggle text-start dropdown-btn h-100 w-100"
      type="button"
      data-bs-toggle="dropdown"
    >
      <div class="dropdown-btn-content">
        <img v-if="selectedOption?.icon" :src="selectedOption!.icon" class="dropdown-option-icon" />
        <div class="dropdown-btn-text">
          <template v-if="selectedOption">
            <div class="dropdown-btn-label fs-6">{{ selectedOption.label }}</div>
            <div v-if="selectedOption.detail" class="dropdown-btn-detail text-muted">
              {{ selectedOption.detail }}
            </div>
          </template>
          <template v-else>—</template>
        </div>
        <span class="dropdown-btn-caret"></span>
      </div>
    </button>
    <ul class="dropdown-menu dropdown-menu-scrollable">
      <li v-for="option in options" :key="option.value">
        <button
          class="dropdown-item d-flex align-items-center gap-2"
          :class="{ active: option.value === modelValue }"
          type="button"
          @click="emit('update:modelValue', option.value)"
        >
          <img v-if="option.icon" :src="option.icon" class="dropdown-option-icon" />
          <div>
            <div>{{ option.label }}</div>
            <div v-if="option.detail" class="dropdown-item-detail">{{ option.detail }}</div>
          </div>
        </button>
      </li>
    </ul>
  </div>
</template>

<style>
.dropdown-btn {
  min-width: 160px;
  line-height: 1.2;
}
.dropdown-btn::after {
  display: none;
}
.dropdown-btn-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.dropdown-btn-text {
  flex: 1;
}
.dropdown-btn-caret {
  display: inline-block;
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid currentColor;
  flex-shrink: 0;
  align-self: center;
}
.dropdown-btn-label {
  font-size: 0.875rem;
  color: var(--bs-body-color);
}
.dropdown-btn-detail {
  font-size: 0.7rem;
}
.dropdown-item-detail {
  font-size: 0.75rem;
  opacity: 0.65;
}
.dropdown-menu-scrollable {
  max-height: 300px;
  overflow-y: auto;
}
.dropdown-option-icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
  flex-shrink: 0;
}
</style>
