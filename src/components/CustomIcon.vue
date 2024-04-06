<script setup>
import { onMounted, ref } from 'vue'

const template = ref('')
const props = defineProps({
  icon: String
})
onMounted(() => {
  fetch(`/icons/${props.icon}.svg`)
    .then((c) => c.text())
    .then((i) => {
      i = i.replace('<svg ', '<svg class="svg-inline--fa" ')
      template.value = i
    })
})
</script>
<template>
  <div v-html="template" class="d-inline" />
</template>
