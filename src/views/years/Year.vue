<template>
  <b-card title="Quản lý năm học">
    <b-row class="mb-1">
      <b-col cols="12" md="6">
        <b-input-group class="input-group-merge">
          <b-input-group-prepend is-text>
            <feather-icon icon="SearchIcon" />
          </b-input-group-prepend>
          <b-form-input placeholder="Tìm kiếm " />
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
      <template #cell(name)="data">
        <div class="d-flex align-items-center">
          <b-avatar
            size="lg"
            :src="require('@/assets/images/portrait/small/avatar-s-20.jpg')"
          />
          <div class="pl-2 d-flex flex-column">
            <span class="">
              {{ data.item.name }}
            </span>
            <span>{{ data.item.email }}</span>
          </div>
        </div>
      </template>
      <template #cell(role)="data">
        <b-badge v-if="data.value === 'ADMIN'" variant="light-dark">
          Admin
        </b-badge>
        <b-badge v-if="data.value === 'ACADEMIC_STAFF'" variant="light-info">
          Giáo vụ
        </b-badge>
        <b-badge v-if="data.value === 'STAFF'" variant="light-primary">
          Nhân viên
        </b-badge>
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
  BAvatar,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import userServices from '@/services/user'

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
    BAvatar,
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
        { key: 'name', label: 'Tên người dùng' },
        { key: 'department', label: 'Khoa' },
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
