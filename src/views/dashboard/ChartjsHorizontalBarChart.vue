<template>
  <b-card no-body>
    <b-card-header>
      <div>
        <b-card-title class="mb-25">
          Thống kê công tác khác của giảng viên
        </b-card-title>
      </div>
      <!-- datepicker -->
      <!-- datepicker -->
    </b-card-header>

    <!-- chart -->
    <b-card-body>
      <chartjs-component-horizontal-bar-chart
        :height="400"
        :data="dataChart"
        :options="chartjsData.horizontalBarChart.options"
      />
    </b-card-body>
  </b-card>
</template>

<script>
import {
  BCard,
  BCardBody,
  BCardHeader,
  BCardTitle,
  BCardSubTitle,
} from 'bootstrap-vue'
import { $themeColors } from '@themeConfig'
import ChartjsComponentHorizontalBarChart from './charts-components/ChartjsComponentHorizontalBarChart.vue'
import chartjsData from './chartjsData.js'

export default {
  components: {
    BCard,
    BCardBody,
    BCardHeader,
    BCardTitle,
    BCardSubTitle,
    ChartjsComponentHorizontalBarChart,
  },
  data() {
    return {
      chartjsData,
      rangePicker: ['2019-05-01', '2019-05-10'],
      dataChart: {
        labels: [
          'Hồ Phúc',
          'Thanh Nhã',
          'Hoàng Linh Nhi',
          'Đồng Thảo Ly',
          'Phan Hồng Nhi',
          'Nguyễn Văn Nam',
          'Hoàng Nhật Anh',
        ],
        datasets: [
          {
            data: [310, 350, 470, 180, 230, 260, 120],
            backgroundColor: $themeColors.info,
            borderColor: 'transparent',
            barThickness: 10,
            label: 'Đã tham gia',
          },
          {
            data: [10, 350, 70, 80, 30, 60, 420],
            backgroundColor: $themeColors.danger,
            borderColor: 'transparent',
            barThickness: 10,
            label: 'Chưa tham gia',
          },
          {
            data: [110, 50, 170, 280, 130, 160, 20],
            backgroundColor: $themeColors.success,
            borderColor: 'transparent',
            barThickness: 10,
            label: 'Sẽ tham gia',
          },
        ],
      },
    }
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-flatpicker.scss';
</style>
