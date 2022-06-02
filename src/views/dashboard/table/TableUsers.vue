<template>
  <b-card title="Thông kê công tác giảng viên">
    <b-row>
      <b-col md="6" class="my-1"> </b-col>
      <b-col md="6" class="my-1">
        <b-form-group label-for="filterInput" class="mb-0">
          <b-input-group size="sm">
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
  BBadge,
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
import semesterServices from '@/services/semester'
import statisticalServices from '@/services/statistical'
import Ripple from 'vue-ripple-directive'

export default {
  components: {
    BTable,
    BAvatar,
    BBadge,
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
      selectedYear: '627398e36d9e76e4c3552a57',
    }
  },
  created() {
    this.getSemesters()
  },
  watch: {
    selectedSemester() {
      this.activityUsersStatistics(this.selectedSemester)
    },
  },
  methods: {
    async activityUsersStatistics(semester) {
      this.isLoading = true
      try {
        const res = await statisticalServices.activityUsersStatistics(semester)
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
    exportExcel(user) {
      window.location.href = `${process.env.VUE_APP_API_URL}/statistical/export?user=${user}&year=${this.selectedYear}`
    },
  },
}
</script>
