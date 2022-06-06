<template>
  <b-card title="Thông kê công tác giảng viên">
    <b-row>
      <b-col md="3" class="my-1">
        <div class="">
          <v-select
            v-model="selectedYear"
            :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
            label="name"
            :reduce="(year) => year._id"
            :options="optionYears"
          >
            <template #option="{ name }">
              <span>Lọc theo: {{ name }}</span>
            </template>
            <template #selected-option="{ name }">
              <span>Lọc theo: {{ name }}</span>
            </template>
          </v-select>
        </div>
      </b-col>
      <b-col md="9" class="my-1">
        <b-form-group label-for="filterInput" class="mb-0">
          <b-input-group>
            <b-form-input
              id="filterInput"
              v-model="filter"
              type="search"
              placeholder="Nhập để tìm kiếm"
            />
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col cols="12">
        <b-table
          striped
          hover
          responsive
          :per-page="perPage"
          :current-page="currentPage"
          :items="items"
          :fields="fields"
          :filter="filter"
        >
          <template #cell(avatar)="data">
            <b-avatar :src="data.value" />
          </template>
          <template #cell(sumOfficeHours)="data">
            <span class="font-weight-bold text-danger">{{ data.value }}</span>
          </template>
          <template #cell(action)="data">
            <b-button
              v-ripple.400="'rgba(40, 199, 111, 0.15)'"
              variant="flat-success"
              class="btn-icon rounded-circle"
            >
              <feather-icon
                icon="DownloadIcon"
                @click="exportExcel(data.item.id)"
              />
            </b-button>
          </template>
        </b-table>
      </b-col>
    </b-row>
    <div class="d-flex justify-content-between align-items-center">
      <b-form-group class="mb-0">
        <label class="d-inline-block text-sm-left mr-50"
          >Số dòng trên trang</label
        >
        <b-form-select
          id="perPageSelect"
          v-model="perPage"
          :options="pageOptions"
          class="w-50"
        />
      </b-form-group>
      <b-pagination
        v-model="currentPage"
        :total-rows="totalRows"
        :per-page="perPage"
        align="center"
        class="my-0"
      />
    </div>
  </b-card>
</template>

<script>
import {
  BTable,
  BAvatar,
  BRow,
  BCol,
  BFormGroup,
  BFormSelect,
  BPagination,
  BInputGroup,
  BFormInput,
  BInputGroupAppend,
  BButton,
  BCard,
} from 'bootstrap-vue'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import semesterServices from '@/services/semester'
import statisticalServices from '@/services/statistical'
import yearServices from '@/services/year'

export default {
  components: {
    BTable,
    BAvatar,
    BRow,
    BCol,
    BFormGroup,
    BFormSelect,
    BPagination,
    BInputGroup,
    BFormInput,
    BButton,
    vSelect,
    BCard,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      perPage: 5,
      pageOptions: [3, 5, 10],
      totalRows: 1,
      currentPage: 1,
      filter: null,
      fields: [
        {
          key: 'avatar',
          label: 'Hình',
        },
        { key: 'name', label: 'Tên', sortable: true },
        { key: 'sumTask', label: 'Số công việc', sortable: true },
        { key: 'notAnswered', label: 'Chưa trả lời', sortable: true },
        { key: 'countAccepted', label: 'Đã chấp nhận', sortable: true },
        { key: 'countRefuse', label: 'Đã từ chối', sortable: true },
        { key: 'countDone', label: 'Đã hoàn thành', sortable: true },
        { key: 'countIncomplete', label: 'Không hoàn thành', sortable: true },
        {
          key: 'sumOfficeHours',
          label: 'Tổng số giờ đã đạt được',
          sortable: true,
        },
        {
          key: 'action',
          label: 'Hành động',
        },
      ],
      items: [],
      isLoading: true,
      selectedSemester: '',
      optionsSemester: [],
      optionYears: [],
      selectedYear: '',
    }
  },
  watch: {
    selectedYear() {
      this.activityUsersStatistics(this.selectedYear)
    },
  },

  created() {
    this.getYears()
    this.getSemesters()
  },
  methods: {
    async activityUsersStatistics(selectedYear) {
      this.isLoading = true
      try {
        const res = await statisticalServices.activityUsersStatistics(
          selectedYear
        )
        this.items = res.data.data.statistic
        this.totalRows = this.items.length
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
    async getSemesters(year) {
      try {
        const res = await semesterServices.getAll({ year })
        this.optionsSemester = res.data.data.semesters
        if (this.optionsSemester.length > 0) {
          // eslint-disable-next-line no-underscore-dangle
          this.selectedSemester = this.optionsSemester[0]._id
        }
      } catch (error) {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Thông báo',
            icon: 'BellIcon',
            text: error.response?.data.message
              ? error.response.data.message
              : error.toString(),
            variant: 'warning',
          },
        })
      }
    },
    async getYears() {
      this.isBusy = true
      try {
        const res = await yearServices.getYears()
        this.optionYears = res.data.data.years
        if (res.data.data.years.length > 0) {
          // eslint-disable-next-line no-underscore-dangle
          this.selectedYear = this.optionYears[0]._id.toString()
        }
      } catch (err) {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Thông báo',
            icon: 'BellIcon',
            text: err.response.data.message,
            variant: 'warning',
          },
        })
      } finally {
        this.isBusy = false
      }
    },
    exportExcel(user) {
      window.location.href = `${process.env.VUE_APP_API_URL}/statistical/export?user=${user}&year=${this.selectedYear}`
    },
  },
}
</script>
