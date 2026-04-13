<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ranks } from '@/constants'
import DropdownComponent from '@/components/basic/DropdownComponent.vue'

const props = withDefaults(
  defineProps<{
    label?: string
    defaultValue?: number
    top10?: boolean
    minFilterElo?: number
    modelValue?: number
  }>(),
  {
    label: 'Rank',
    defaultValue: 0,
    top10: false,
    minFilterElo: 0
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const internalValue = ref<number>(
  props.modelValue !== undefined
    ? props.modelValue
    : Math.max(props.defaultValue, props.minFilterElo)
)

const selectedValue = computed({
  get: () => (props.modelValue !== undefined ? props.modelValue : internalValue.value),
  set: (val: number) => {
    internalValue.value = val
    emit('update:modelValue', val)
  }
})

watch(
  () => props.modelValue,
  (val) => {
    if (val !== undefined) internalValue.value = val
  }
)

const rankOptions = computed(() => {
  const options: { value: number; label: string; detail: string; icon?: string }[] = []
  for (let i = 0; i < ranks.length; i++) {
    const rank = ranks[i]
    if (rank.minElo < props.minFilterElo) continue
    const maxElo = i === 0 ? null : ranks[i - 1].minElo - 1
    const detail =
      maxElo !== null
        ? `${rank.minElo} – ${maxElo} pts`
        : props.top10
          ? `${rank.minElo}+ pts & Top 10`
          : `${rank.minElo}+ pts`
    options.push({
      value: rank.minElo,
      label: rank.name,
      detail,
      icon: `/images/${rank.image}`
    })
  }
  return options
})

const minElo = computed(() => selectedValue.value)
const maxElo = computed(() => {
  const idx = ranks.findIndex((r) => r.minElo === selectedValue.value)
  return idx === 0 ? 99999 : ranks[idx - 1].minElo - 1
})

defineExpose({ minElo, maxElo })
</script>

<template>
  <div class="d-flex flex-column">
    <label class="form-label fw-semibold mb-0">{{ label }}</label>
    <DropdownComponent :options="rankOptions" v-model="selectedValue" />
  </div>
</template>
