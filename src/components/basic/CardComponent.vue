<template>
  <div :class="`${classes ?? ''} px-1 align-items-stretch d-flex mb-2`">
    <div class="card d-flex flex-column p-2 w-100 overflow-x-auto">
      <div class="d-flex justify-content-between align-items-center w-100">
        <h5 class="d-inline-flex gap-1">
          <span>{{ props.title }}</span>
          <div class="tooltip-container" v-if="props.tooltip">
            <FontAwesomeIcon :icon="faCircleQuestion" />
            <div class="tooltip-sub-container">
              <span class="tooltip-text">{{ props.tooltip }}</span>
            </div>
          </div>
        </h5>
        <div class="d-flex gap-2">
          <slot name="filters"></slot>
        </div>
      </div>
      <slot name="main"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons'

const props = defineProps({
  title: { type: String, required: true },
  tooltip: { type: String, required: false },
  classes: { type: String, required: false }
})
</script>

<style scoped>
.tooltip-container {
  position: relative;
  display: inline-flex;
  align-items: self-start;
  margin-top: 4px;
  z-index: 10000;
  overflow: visible;
}
.tooltip-container .tooltip-text {
  display: none;
  opacity: 0;
  padding: 4px;
  background: #e8e8e8;
  border-radius: 5px;
  transition: display 0.6s;
  font-size: 10pt;
}
.tooltip-sub-container {
  position: absolute;
  width: 250px;
  left: 30px;
  display: flex;
  justify-content: flex-start;
}
.tooltip-container:hover .tooltip-text {
  display: block;
  opacity: 1;
}
</style>
