<template>
  <b-row class="match-height">
    <b-col md="6">
      <chartjs-horizontal-bar-chart />
    </b-col>
  </b-row>
</template>

<script>
import { BRow, BCol } from 'bootstrap-vue'
import ChartjsHorizontalBarChart from './ChartjsHorizontalBarChart.vue'

export default {
  components: {
    BRow,
    BCol,
    ChartjsHorizontalBarChart,
  },
  beforeCreate() {
    this.$OneSignal.showSlidedownPrompt()
  },
}
</script>
