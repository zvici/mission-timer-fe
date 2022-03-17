<template>
  <b-card title="Quản lý người dùng">
    <b-row class="mb-1">
      <b-col cols="12" md="6">
        <b-input-group class="input-group-merge">
          <b-input-group-prepend is-text>
            <feather-icon icon="SearchIcon" />
          </b-input-group-prepend>
          <b-form-input placeholder="Search" />
        </b-input-group>
      </b-col>
      <b-col class="d-flex justify-content-end" cols="12" md="6">
        <b-button variant="outline-primary" @click="openModalAdd">
          <feather-icon icon="UserPlusIcon" /> Thêm người dùng
        </b-button>
        <b-button
          v-ripple.400="'rgba(113, 102, 240, 0.15)'"
          v-b-tooltip.hover.top.v-success="'Thêm người dùng bằng file Excel'"
          class="btn-icon ml-1"
          variant="gradient-success"
        >
          <feather-icon icon="FilePlusIcon" />
        </b-button>
      </b-col>
    </b-row>
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
    <modal-add-user
      :is-visible="isVisibleModalAdd"
      @close-modal-add="closeModalAdd"
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
import userServices from '@/services/user'
import ModalAddUser from './ModalAddUser.vue'

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
    ModalAddUser,
  },
  directives: {
    'b-tooltip': VBTooltip,
    Ripple,
  },
  data() {
    return {
      fields: [
        { key: 'index', label: 'STT' },
        { key: 'userId', label: 'Mã người dùng' },
        { key: 'name', label: 'Họ tên' },
        { key: 'department', label: 'Khoa' },
        { key: 'role', label: 'Quyền' },
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
    this.getAllUser()
  },
  methods: {
    async getAllUser() {
      this.isBusy = true
      try {
        const res = await userServices.getUsers()
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

<style></style>
