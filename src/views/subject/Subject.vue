<template>
  <b-card title="Quản lý bộ môn">
    <b-row class="mb-1">
      <b-col cols="12" md="3">
        <div class="">
          <v-select
            v-model="selectedDepartment"
            :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
            label="name"
            :reduce="(department) => department._id"
            :options="optionDepartments"
            placeholder="Lọc theo: Tất cả"
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
      <b-col cols="12" md="5">
        <b-input-group class="input-group-merge">
          <b-input-group-prepend is-text>
            <feather-icon icon="SearchIcon" />
          </b-input-group-prepend>
          <b-form-input v-model="searchQuery" placeholder="Tìm kiếm bộ môn" />
        </b-input-group>
      </b-col>
      <b-col class="d-flex justify-content-end" cols="12" md="4">
        <b-button variant="primary" @click="openModalAdd(null)">
          <feather-icon icon="PlusIcon" /> Thêm bộ môn
        </b-button>
      </b-col>
    </b-row>
    <b-table
      :fields="fields"
      :items="resultQuery"
      responsive="sm"
      bordered
      show-empty
      :busy="isBusy"
    >
      <!-- A virtual column -->
      <template #cell(index)="data">
        {{ data.index + 1 }}
      </template>
      <template #cell(department)="data">
        <span>{{ data.value.name }}</span>
      </template>
      <template #cell(createdBy)="data">
        <span>{{ data.value.name }}</span>
      </template>
      <template #cell(createdAt)="data">
        <span>{{ data.value | filterDateTime }}</span>
      </template>
      <template #cell(updatedBy)="data">
        <span>{{ data.value.name }}</span>
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
            @click="openModalAdd(data.item)"
          >
            <feather-icon icon="EditIcon" />
          </b-button>
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="gradient-danger"
            class="btn-icon rounded-circle ml-1"
            @click="deleteSemester(data.item._id)"
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
    <add-update-modal
      :is-visible="isVisibleModalAdd"
      :data-edit="dataEdit"
      @close-modal-add="closeModalAdd"
      @reload-data="getDataTable"
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
import vSelect from 'vue-select'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import semesterServices from '@/services/semester'
import departmentServices from '@/services/department'
import AddUpdateModal from './AddUpdateModal.vue'
import subjectServices from '@/services/subject'

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
    AddUpdateModal,
    vSelect,
  },
  directives: {
    'b-tooltip': VBTooltip,
    Ripple,
  },
  data() {
    return {
      fields: [
        { key: 'index', label: 'STT' },
        { key: 'name', label: 'Tên' },
        { key: 'department', label: 'Khoa' },
        { key: 'description', label: 'Mô tả' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Số điện thoại' },
        { key: 'createdBy', label: 'Tạo bởi' },
        { key: 'createdAt', label: 'Ngày tạo' },
        { key: 'updatedBy', label: 'Cập nhật bởi' },
        { key: 'updatedAt', label: 'Ngày cập nhật' },
        { key: 'action', label: 'Hành động' },
      ],
      items: [],
      isBusy: true,
      empty: {
        text: 'Không có dữ liệu',
        status: 'text-primary',
      },
      isVisibleModalAdd: false,
      searchQuery: '',
      dataEdit: null,
      optionDepartments: [],
      selectedDepartment: '',
    }
  },
  computed: {
    resultQuery() {
      if (this.searchQuery) {
        return this.items.filter((item) =>
          this.searchQuery
            .toLowerCase()
            .split(' ')
            .every(
              (v) =>
                item.name.toLowerCase().includes(v) ||
                item.department.name.toLowerCase().includes(v)
            )
        )
      }
      return this.items
    },
  },
  watch: {
    selectedDepartment() {
      this.getDataTable()
    },
  },
  created() {
    this.getDepartments()
    this.getDataTable()
  },
  methods: {
    async getDataTable() {
      this.isBusy = true
      try {
        const res = await subjectServices.getSubjects(this.selectedDepartment)
        this.items = res.data.data.subjects
      } catch (err) {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Thông báo',
            icon: 'BellIcon',
            text: err.response.data.message
              ? err.response.data.message
              : err.toString(),
            variant: 'warning',
          },
        })
      } finally {
        this.isBusy = false
      }
    },
    async deleteSemester(id) {
      this.$swal({
        title: 'Bạn chắc chứ?',
        text: 'Bạn sẽ không thể hoàn tác hành động này!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Vâng, tôi sẽ xoá nó!',
        cancelButtonText: 'Đóng',
        customClass: {
          confirmButton: 'btn btn-outline-danger',
          cancelButton: 'btn btn-primary ml-1',
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          semesterServices
            .delete(id)
            .then((res) => {
              this.$swal({
                icon: 'success',
                title: 'Đã xoá!',
                text: res.data.message,
                customClass: {
                  confirmButton: 'btn btn-success',
                },
              })
            })
            .catch((err) => {
              this.$swal({
                icon: 'error',
                title: 'Lỗi!',
                text: err.response?.data.message,
                customClass: {
                  confirmButton: 'btn btn-success',
                },
              })
            })
            .finally(() => {
              this.getDataTable()
            })
        }
      })
    },
    async getDepartments() {
      this.isBusy = true
      try {
        const res = await departmentServices.getDepartments()
        this.optionDepartments = [
          { _id: '', name: 'Tất cả' },
          ...res.data.data.departments,
        ]
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
    openModalAdd(data) {
      this.dataEdit = data
      this.isVisibleModalAdd = true
    },
    closeModalAdd() {
      this.isVisibleModalAdd = false
    },
  },
}
</script>
