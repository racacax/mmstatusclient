<template>
  <div>
    <highcharts
      :constructor-type="'stockChart'"
      class="hc"
      :options="chartOptions"
      ref="chart"
    ></highcharts>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { dateFormat } from 'highcharts'

const props = defineProps({
  data: Array,
  categories: Array,
  label: String,
  enableLegend: Boolean
})

function formatData() {
  return {
    chart: {
      type: 'column',
      styledMode: true
    },
    tooltip: {
      split: false,
      shared: false
    },
    scrollbar: {
      enabled: false
    },
    rangeSelector: {
      inputEnabled: false,
      enabled: true,
      buttons: []
    },
    title: {
      text: ''
    },
    xAxis: {
      categories: props.categories?.map((cat) => dateFormat(cat as string, 0))
    },
    yAxis: {
      min: 0,
      offset: 20,
      labels: {},
      title: {
        text: props.label
      }
    },
    legend: {
      enabled: props.enableLegend === true,
      reversed: true
    },
    plotOptions: {
      series: {
        stacking: 'normal',
        dataGrouping: {
          enabled: false
        },
        dataLabels: {
          enabled: false
        }
      }
    },
    series: props.data
  }
}

const chartOptions = ref(formatData())
watch(
  () => [props.categories, props.data, props.label],
  () => (chartOptions.value = formatData())
)
</script>
