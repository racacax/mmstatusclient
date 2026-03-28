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

const LIGHT_STOPS: [number, string][] = [
  [0, '#f7f7f7'],
  [0.25, '#fdcc8a'],
  [0.6, '#fc8d59'],
  [1, '#b30000']
]

const DARK_STOPS: [number, string][] = [
  [0, '#1a1a1a'],
  [0.25, '#5a2d00'],
  [0.6, '#a03000'],
  [1, '#cc2200']
]

function isDark() {
  return document.body.getAttribute('data-bs-theme') === 'dark'
}

function renderColors(chart: any) {
  const series = chart.series?.[0]
  if (!series?.points) return
  series.points.forEach((point: any) => {
    if (point.graphic && point.color) {
      point.graphic.element.style.fill = point.color
    }
  })
}

function formatData() {
  const dark = isDark()
  const stops = dark ? DARK_STOPS : LIGHT_STOPS
  const labelColor = dark ? '#d6d6d6' : '#333333'
  const gridColor = dark ? '#474747' : '#e6e6e6'

  return {
    chart: {
      type: 'heatmap',
      styledMode: false,
      marginTop: 20,
      marginBottom: 80,
      backgroundColor: 'transparent',
      events: {
        render: function (this: any) {
          renderColors(this)
        }
      }
    },
    title: { text: '' },
    xAxis: {
      categories: props.xCategories,
      labels: { style: { color: labelColor } },
      lineColor: gridColor,
      tickColor: gridColor
    },
    yAxis: {
      categories: props.yCategories,
      title: null,
      reversed: false,
      labels: { style: { color: labelColor } },
      gridLineColor: gridColor
    },
    colorAxis: {
      min: 0,
      max: props.colorAxisMax,
      stops,
      labels: { style: { color: labelColor } }
    },
    legend: {
      align: 'right',
      layout: 'vertical',
      margin: 0,
      verticalAlign: 'top',
      symbolHeight: 280,
      itemStyle: { color: labelColor }
    },
    tooltip: {
      backgroundColor: dark ? '#393939' : '#f7f7f7',
      style: { color: labelColor },
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
          style: { color: labelColor, textOutline: 'none' }
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
