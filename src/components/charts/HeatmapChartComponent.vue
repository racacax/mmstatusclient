<template>
  <div>
    <highcharts class="hc" :options="chartOptions" ref="chart"></highcharts>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  data: [number, number, number][]
  xCategories: string[]
  yCategories: string[]
  colorAxisMax?: number
}>()

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function formatData() {
  return {
    chart: {
      type: 'heatmap',
      styledMode: true,
      marginTop: 20,
      marginBottom: 80
    },
    title: { text: '' },
    xAxis: {
      categories: props.xCategories
    },
    yAxis: {
      categories: props.yCategories,
      title: null,
      reversed: false
    },
    colorAxis: {
      min: 0,
      max: props.colorAxisMax,
      minColor: 'var(--heatmap-min)',
      maxColor: 'var(--heatmap-max)'
    },
    legend: {
      align: 'right',
      layout: 'vertical',
      margin: 0,
      verticalAlign: 'top',
      symbolHeight: 280
    },
    tooltip: {
      formatter: function (this: any) {
        return `<b>${props.yCategories[this.point.y]}</b> on <b>${props.xCategories[this.point.x]}</b>: <b>${this.point.value}</b> games`
      }
    },
    series: [
      {
        name: 'Games played',
        borderWidth: 1,
        data: props.data,
        dataLabels: {
          enabled: true,
          color: 'var(--heatmap-label)'
        }
      }
    ]
  }
}

const chartOptions = ref(formatData())
watch(
  () => [props.data, props.xCategories, props.yCategories, props.colorAxisMax],
  () => (chartOptions.value = formatData())
)
</script>
