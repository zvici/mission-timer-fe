<template>
  <b-card no-body>
    <b-card-header>
      <b-card-title>Thống kế số giờ các giảng viên</b-card-title>
      <!-- datepicker -->
      <div class="d-flex align-items-center">
        <feather-icon
          icon="CalendarIcon"
          size="16"
        />
        <flat-pickr
          v-model="rangePicker"
          :config="{ mode: 'range' }"
          class="form-control flat-picker bg-transparent border-0 shadow-none"
          placeholder="YYYY-MM-DD"
        />
      </div>
      <!-- datepicker -->
    </b-card-header>

    <!-- chart -->
    <b-card-body>
      <chartjs-component-bar-chart
        v-if="!isLoading"
        :height="400"
        :data="dataChart"
        :options="chartjsData.latestBarChart.options"
      />
    </b-card-body>
  </b-card>
</template>

<script>
import {
  BCard, BCardHeader, BCardBody, BCardTitle,
} from 'bootstrap-vue'
import flatPickr from 'vue-flatpickr-component'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import statisticalServices from '@/services/statistical'
import ChartjsComponentBarChart from './charts-components/ChartjsComponentBarChart.vue'
import chartjsData from './chartjsData'

export default {
  components: {
    BCard,
    BCardHeader,
    BCardBody,
    BCardTitle,
    flatPickr,
    ChartjsComponentBarChart,
  },
  data() {
    return {
      isLoading: true,
      chartjsData,
      rangePicker: ['2019-05-01', '2019-05-10'],
      dataChart: {
        labels: [],
        datasets: [
          {
            data: [],
            label: 'Tổng số công việc',
            backgroundColor: '#836AF9',
            borderColor: 'transparent',
          },
          {
            data: [],
            label: 'Đã hoàn thành',
            backgroundColor: '#28C76F',
            borderColor: 'transparent',
          },
          {
            data: [],
            label: 'Không hoàn thành',
            backgroundColor: '#FDAC34',
            borderColor: 'transparent',
          },
          {
            data: [],
            label: 'Chưa trả lời',
            backgroundColor: '#4F5D70',
            borderColor: 'transparent',
          },
          {
            data: [],
            label: 'Chấp nhận',
            backgroundColor: '#ffe800',
            borderColor: 'transparent',
          },
          {
            data: [],
            label: 'Từ chối',
            backgroundColor: '#EB6061',
            borderColor: 'transparent',
          },
        ],
      },
    }
  },
  created() {
    this.activityUsersStatistics()
  },
  methods: {
    async activityUsersStatistics() {
      this.isLoading = true
      try {
        const res = await statisticalServices.activityUsersStatistics()
        if (res.data.data.statistic.length > 0) {
          // eslint-disable-next-line array-callback-return
          res.data.data.statistic.map(item => {
            this.dataChart.labels.push(item.name)
            this.dataChart.datasets[0].data.push(item.sumTask)
            this.dataChart.datasets[1].data.push(item.countDone)
            this.dataChart.datasets[2].data.push(item.countIncomplete)
            this.dataChart.datasets[3].data.push(item.notAnswered)
            this.dataChart.datasets[4].data.push(item.countAccepted)
            this.dataChart.datasets[5].data.push(item.countRefuse)
          })
        }
      } catch (error) {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Thông báo',
            icon: 'BellIcon',
            text: error.response?.data.message
              ? error.response?.data.message
              : error.toString(),
            variant: 'warning',
          },
        })
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-flatpicker.scss';
</style>
