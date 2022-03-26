<template>
  <b-card title="Quản lý năm học">
    <div class="d-flex justify-content-end mb-1">
      <b-button
        variant="outline-primary"
        @click="openModalAdd"
      >
        <feather-icon icon="UserPlusIcon" /> Thêm năm học
      </b-button>
    </div>
    <b-table
      :fields="fields"
      :items="items"
      responsive="sm"
      bordered
      show-empty
      :busy="isBusy"
    >
      <!-- A virtual column -->
      <template #cell(index)="data">
        {{ data.index + 1 }}
      </template>
      <template #cell(startDate)="data">
        {{ data.value | formatDate }}
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
    <add-year
      :is-visible="isVisibleModalAdd"
      @close-modal-add="closeModalAdd"
      @reload-data="getAllYear"
    />
  </b-card>
</template>

<script>
import {
  BCard,
  BTable,
  BSpinner,
  BButton,
  VBTooltip,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import moment from 'moment'
import yearServices from '@/services/year'
import AddYear from './AddYear.vue'

export default {
  components: {
    BCard,
    BTable,
    BSpinner,
    BButton,
    AddYear,
  },
  directives: {
    'b-tooltip': VBTooltip,
    Ripple,
  },
  filters: {
    formatDate(value) {
      return moment(value).format('DD/MM/YYYY')
    },
  },
  data() {
    return {
      fields: [
        { key: 'index', label: 'STT' },
        { key: 'name', label: 'Năm học' },
        {
          key: 'startDate',
          sortable: true,
          label: 'Ngày bắt đầu',
        },
        { key: 'endDate', label: 'Ngày kết thúc' },
        { key: 'description', label: 'Ghi chú' },
        { key: 'action', label: '' },
      ],
      items: [],
      isBusy: true,
      empty: {
        text: 'Không có dữ liệu',
        status: 'text-primary',
      },
      isVisibleModalAdd: false,
    }
  },
  created() {
    this.getAllYear()
  },
  methods: {
    async getAllYear() {
      this.isBusy = true
      try {
        const res = await yearServices.getYears()
        this.items = res.data.data
      } catch {
        console.log('looix roi')
      } finally {
        this.isBusy = false
      }
    },
    openModalAdd() {
      this.isVisibleModalAdd = true
    },
    closeModalAdd() {
      this.isVisibleModalAdd = false
    },
  },
}
</script>
