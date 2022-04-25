<template>
  <b-row class="match-height">
    <b-col md="6">
      <chartjs-horizontal-bar-chart />
    </b-col>
  </b-row>
</template>

<script>
import { BRow, BCol } from 'bootstrap-vue'
import OneSignalVue from 'onesignal-vue'
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
  created() {
    OneSignal.on('subscriptionChange', function (isSubscribed) {
      console.log("The user's subscription state is now:", isSubscribed)
    })
  },
}
</script>
