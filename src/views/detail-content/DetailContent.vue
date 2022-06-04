<template>
  <b-card title="Quản lý chi tiết nội dung công tác">
    <b-row class="mb-1">
      <b-col
        cols="12"
        md="3"
      >
        <div class="">
          <v-select
            v-model="selectedContent"
            :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
            label="title"
            :reduce="content => content._id"
            :options="optionContents"
            placeholder="Lọc theo: Tất cả"
          />
        </div>
      </b-col>
      <b-col
        cols="12"
        md="5"
      >
        <b-input-group class="input-group-merge">
          <b-input-group-prepend is-text>
            <feather-icon icon="SearchIcon" />
          </b-input-group-prepend>
          <b-form-input
            v-model="filter"
            placeholder="Tìm kiếm nội dung công tác"
          />
        </b-input-group>
      </b-col>
      <b-col
        class="d-flex justify-content-end"
        cols="12"
        md="4"
      >
        <b-button
          variant="primary"
          @click="openModalAdd(null)"
        >
          <feather-icon icon="PlusIcon" /> Thêm chi tiết nội dung công tác
        </b-button>
      </b-col>
    </b-row>
    <b-table
      striped
      :fields="fields"
      :items="items"
      responsive
      bordered
      show-empty
      :busy="isBusy"
      :per-page="perPage"
      :current-page="currentPage"
      :filter="filter"
    >
      <!-- A virtual column -->
      <template #cell(index)="data">
        {{ data.index + 1 }}
      </template>
      <template #cell(type)="data">
        <div class="text-center">
          <b-badge
            v-if="data.value === 'STAFF'"
            variant="primary"
          >
            Tự điểm danh
          </b-badge>
          <b-badge
            v-if="data.value === 'MINISTRY'"
            variant="success"
          >
            Giáo vụ điểm danh
          </b-badge>
          <b-badge
            v-if="data.value === 'MONITOR_EXAM'"
            variant="warning"
          >
            Canh thi
          </b-badge>
        </div>
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
    <!-- Pagination -->
    <div class="d-flex justify-content-between align-items-center">
      <b-form-group class="mb-0">
        <label
          class="d-inline-block text-sm-left mr-50"
        >Số dòng trên trang</label>
        <b-form-select
          id="perPageSelect"
          v-model="perPage"
          size="md"
          :options="pageOptions"
          class="w-50"
        />
      </b-form-group>
      <b-pagination
        v-model="currentPage"
        :total-rows="totalRows"
        :per-page="perPage"
        align="center"
        size="md"
        class="my-0"
      />
    </div>
    <add-content-detail
      :is-visible="isVisibleModalAdd"
      :data-edit="dataEdit"
      @close-modal-add="closeModalAdd"
      @reload-data="getActivities"
    />
  </b-card>
</template>

<script>
import {
  BFormGroup,
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
  BPagination,
  BFormSelect,
  BBadge,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import contentServices from '@/services/content'
import activityServices from '@/services/actitvity'
import AddContentDetail from './AddContentDetail.vue'

export default {
  components: {
    BFormGroup,
    BInputGroup,
    BFormInput,
    BInputGroupPrepend,
    BCard,
    BTable,
    BSpinner,
    BButton,
    BRow,
    BCol,
    BBadge,
    BPagination,
    BFormSelect,
    AddContentDetail,
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
        { key: 'title', label: 'Tiêu đề' },
        { key: 'quota', label: 'Định mức' },
        { key: 'description', label: 'Mô tả' },
        { key: 'type', label: 'Loại' },
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
      optionContents: [],
      selectedContent: '',
      perPage: 5,
      pageOptions: [5, 10, 15],
      totalRows: 1,
      currentPage: 1,
      filter: null,
    }
  },
  computed: {},
  watch: {
    selectedContent() {
      this.getActivities()
    },
  },
  created() {
    this.getContents()
    this.getActivities()
  },
  methods: {
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    async getActivities() {
      this.isBusy = true
      try {
        const res = await activityServices.getActivities({
          content: this.selectedContent,
        })
        this.items = res.data.data.activities
        this.totalRows = this.items.length
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
    async deleteContent(id) {
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
      }).then(result => {
        if (result.value) {
          contentServices
            .deleteContent(id)
            .then(res => {
              this.$swal({
                icon: 'success',
                title: 'Đã xoá!',
                text: res.data.message,
                customClass: {
                  confirmButton: 'btn btn-success',
                },
              })
            })
            .catch(err => {
              this.$swal({
                icon: 'error',
                title: 'Lỗi!',
                text: err.response.data.message,
                customClass: {
                  confirmButton: 'btn btn-success',
                },
              })
            })
            .finally(() => {
              this.getActivities()
            })
        }
      })
    },
    async getContents() {
      this.isBusy = true
      try {
        const res = await contentServices.getContens()
        this.optionContents = [
          { _id: '', title: 'Lọc theo: Tất cả' },
          ...res.data.data.contents,
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
