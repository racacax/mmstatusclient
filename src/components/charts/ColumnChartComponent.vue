<template>
  <div>
    <highcharts class="hc" :options="chartOptions" ref="chart"></highcharts>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  data: Array,
  label: String
})

const chartOptions = computed(() => ({
  chart: { type: 'column', styledMode: true },
  title: { text: '' },
  xAxis: {
    type: 'datetime',
    labels: { format: '{value:%b %d}' }
  },
  yAxis: {
    min: 0,
    title: { text: props.label }
  },
  legend: { enabled: false },
  tooltip: {
    headerFormat: '<b>{point.x:%b %d, %Y}</b><br/>',
    pointFormat: `{series.name}: <b>{point.y}</b>`
  },
  plotOptions: {
    column: { pointPadding: 0.1, borderWidth: 0 }
  },
  series: [{ name: props.label, data: props.data }]
}))
</script>
