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
            v-model="searchQuery"
            placeholder="Tìm kiếm chi tiết nội dung công tác"
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
      <template #cell(type)="data">
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
    }
  },
  computed: {
    resultQuery() {
      if (this.searchQuery) {
        return this.items.filter(item => this.searchQuery
          .toLowerCase()
          .split(' ')
          .every(v => item.title.toLowerCase().includes(v)))
      }
      return this.items
    },
  },
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
    async getActivities() {
      this.isBusy = true
      try {
        const res = await activityServices.getActivities({
          content: this.selectedContent,
        })
        this.items = res.data.data.activities
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

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
