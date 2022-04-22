<template>
  <b-card title="Quản lý nội dung công tác">
    <b-row class="mb-1">
      <b-col
        cols="12"
        md="6"
      >
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
      <b-col
        class="d-flex justify-content-end"
        cols="12"
        md="6"
      >
        <b-button
          variant="primary"
          @click="openModalAdd"
        >
          <feather-icon icon="PlusIcon" /> Thêm nội dung công tác
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
        <b-button
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          variant="gradient-info"
          class="btn-icon rounded-circle"
          @click="openModalAdd"
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
    <add-content
      :is-visible="isVisibleModalAdd"
      @close-modal-add="closeModalAdd"
      @reload-data="getContents"
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
import contentServices from '@/services/content'
import AddContent from './AddContent.vue'

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
    AddContent,
  },
  directives: {
    'b-tooltip': VBTooltip,
    Ripple,
  },
  data() {
    return {
      fields: [
        { key: 'index', label: 'STT' },
        { key: 'title', label: 'Nội dung' },
        { key: 'description', label: 'Mô tả' },
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
  created() {
    this.getContents()
  },
  methods: {
    async getContents() {
      this.isBusy = true
      try {
        const res = await contentServices.getContens()
        this.items = res.data.data.contents
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
    async deleteContent(id) {
      this.$swal({
        title: 'Bạn chắc chứ?',
        text: 'Bạn sẽ không thể hoàn tác hành động này!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Vâng, tôi sẽ xoá nó!',
        cancelButtonText: 'Đóng!',
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
              this.getContents()
            })
        }
      })
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

<style></style>
