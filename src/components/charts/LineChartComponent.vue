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

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  data: Array,
  reverse: Boolean,
  label: String
})

function formatData() {
  return {
    chart: {
      styledMode: true
    },
    rangeSelector: {
      buttons: [
        {
          type: 'month',
          count: 1,
          text: '1m',
          title: 'View 1 month'
        },
        {
          type: 'day',
          count: 15,
          text: '15d',
          title: 'View 15 days'
        },
        {
          type: 'day',
          count: 7,
          text: '7d',
          title: 'View 7 days'
        },
        {
          type: 'day',
          count: 1,
          text: '1d',
          title: 'View 1 day'
        },
        {
          type: 'all',
          text: 'All',
          title: 'View all'
        }
      ]
    },

    title: {
      text: ''
    },

    series: [
      {
        name: props.label,
        data: props.data,
        tooltip: {
          valueDecimals: 2
        }
      }
    ],
    yAxis: {
      reversed: props.reverse
    }
  }
}

const chartOptions = ref(formatData())
watch(
  () => [props.data, props.label],
  () => (chartOptions.value = formatData())
)
</script>
