<template>
  <div>
    <highcharts
      :constructorType="'mapChart'"
      class="hc"
      :options="chartOptions"
      ref="chart"
    ></highcharts>
  </div>
</template>

<script setup lang="ts">
import worldMap from '@highcharts/map-collection/custom/world.geo.json'
import { computed } from 'vue'

const props = defineProps({
  data: Array,
  label: String
})

const chartOptions = computed(() => ({
  chart: {
    map: worldMap,
    styledMode: true
  },
  title: { text: '' },
  mapNavigation: {
    enabled: true,
    mouseWheelSensitivity: 2,
    buttonOptions: { alignTo: 'spacingBox' }
  },
  colorAxis: {
    min: 0,
    minColor: '#6bd7ec',
    maxColor: '#212a73'
  },
  series: [
    {
      name: props.label,
      states: { hover: { color: '#55da9e' } },
      dataLabels: { enabled: true, format: '{point.value}' },
      allAreas: true,
      data: props.data ?? []
    }
  ]
}))
</script>
