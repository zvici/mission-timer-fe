<template>
  <b-card title="Quản lý nội dung công tác">
    <b-row class="mb-1">
      <b-col cols="12" md="6">
        <b-input-group class="input-group-merge">
          <b-input-group-prepend is-text>
            <feather-icon icon="SearchIcon" />
          </b-input-group-prepend>
          <b-form-input
            v-model="searchQuery"
            placeholder="Tìm kiếm nội dung công tác"
          />
        </b-input-group>
      </b-col>
      <b-col class="d-flex justify-content-end" cols="12" md="6">
        <b-button variant="primary" @click="openSemesterModal(null)">
          <feather-icon icon="PlusIcon" /> Thêm học kỳ
        </b-button>
      </b-col>
    </b-row>
    <b-table
      :fields="fields"
      :items="semesters"
      responsive="sm"
      bordered
      show-empty
      :busy="isBusy"
    >
      <!-- A virtual column -->
      <template #cell(index)="data">
        {{ data.index + 1 }}
      </template>
      <template #cell(year)="data">
        <span>{{ getYearName(data.value) }}</span>
      </template>
      <template #cell(startDate)="data">
        <span>{{ data.value | filterDate }}</span>
      </template>
      <template #cell(createdAt)="data">
        <span>{{ data.value | filterDateTime }}</span>
      </template>
      <template #cell(updatedAt)="data">
        <span>{{ data.value | filterDateTime }}</span>
      </template>
      <template #cell(action)="data">
        <div class="d-flex">
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="gradient-info"
            class="btn-icon rounded-circle"
            @click="openSemesterModal(data.item)"
          >
            <feather-icon icon="EditIcon" />
          </b-button>
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="gradient-danger"
            class="btn-icon rounded-circle ml-1"
            @click="deleteContent(data.item._id)"
          >
            <feather-icon icon="Trash2Icon" />
          </b-button>
        </div>
      </template>
      <template #empty>
        <p :class="`text-center ${empty.status} m-0 py-3`">
          {{ empty.text }}
        </p>
      </template>
      <template #table-busy>
        <div class="text-center text-primary my-2">
          <b-spinner class="align-middle" />
        </div>
      </template>
    </b-table>
    <semester-modal
      :is-visible="semesterModal.isVisible"
      :semester="semesterModal.semester"
      :years="years"
      @close-semester-modal="closeSemesterModal"
      @reload-data="getSemesters"
      @create-semester="createSemester"
      @update-semester="updateSemester"
    />
  </b-card>
</template>

<script>
import {
  BInputGroup,
  BFormInput,
  BInputGroupPrepend,
  BCard,
  BTable,
  BSpinner,
  BButton,
  BRow,
  BCol,
  VBTooltip,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import semesterService from '@/services/semester'
import yearService from '@/services/year'
import SemesterModal from './SemesterModal.vue'

export default {
  components: {
    BInputGroup,
    BFormInput,
    BInputGroupPrepend,
    BCard,
    BTable,
    BSpinner,
    BButton,
    BRow,
    BCol,
    SemesterModal,
  },
  directives: {
    'b-tooltip': VBTooltip,
    Ripple,
  },
  data() {
    return {
      // table column
      fields: [
        { key: 'index', label: 'STT' },
        { key: 'name', label: 'Học kỳ' },
        { key: 'year', label: 'Năm học' },
        { key: 'startDate', label: 'Ngày bắt đầu' },
        { key: 'createdAt', label: 'Ngày tạo' },
        { key: 'updatedAt', label: 'Ngày cập nhật' },
        { key: 'action', label: 'Hành động' },
      ],

      semesters: [],
      years: [],

      // loading
      isBusy: true,
      empty: {
        text: 'Không có dữ liệu',
        status: 'text-primary',
      },
      searchQuery: '',

      semesterModal: {
        isVisible: false,
        semester: null,
      },
    }
  },

  async created() {
    await this.getSemesters()
    await this.getYears()
  },

  methods: {
    // get semeters api
    async getSemesters() {
      this.isBusy = true
      try {
        const response = await semesterService.getAll()
        this.semesters = response.data.data.semesters
      } catch (err) {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Thông báo',
            icon: 'BellIcon',
            text: err.response?.data.message,
            variant: 'warning',
          },
        })
      } finally {
        this.isBusy = false
      }
    },

    // create new semester api
    async createSemester(payload) {
      this.isBusy = true
      try {
        await semesterService.create(payload)
      } catch (err) {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Thông báo',
            icon: 'BellIcon',
            text: err.response?.data.message,
            variant: 'warning',
          },
        })
      } finally {
        this.isBusy = false
      }
    },

    // udpdate semester api
    async updateSemester(payload) {
      this.isBusy = true
      try {
        await semesterService.update(payload)
      } catch (err) {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Thông báo',
            icon: 'BellIcon',
            text: err.response?.data.message,
            variant: 'warning',
          },
        })
      } finally {
        this.isBusy = false
      }
    },

    // get years from api
    async getYears() {
      this.isBusy = true
      try {
        const response = await yearService.getYears()
        this.years = response.data.data.years
      } catch (err) {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Thông báo',
            icon: 'BellIcon',
            text: err.response?.data.message,
            variant: 'warning',
          },
        })
      } finally {
        this.isBusy = false
      }
    },

    // get year name from year id
    getYearName(id) {
      // eslint-disable-next-line no-underscore-dangle
      const year = this.years.find((y) => y._id === id)

      if (!year) return id

      return year.name
    },

    openSemesterModal(data) {
      this.semesterModal.semester = data
      this.semesterModal.isVisible = true
    },
    closeSemesterModal() {
      this.semesterModal.isVisible = false
    },
  },
}
</script>

<style></style>
