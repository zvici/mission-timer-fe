<template>
  <b-card title="Quản lý người dùng">
    <b-row class="mb-1">
      <b-col cols="12" md="3">
        <div class="">
          <v-select
            v-model="selectedRole"
            :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
            label="name"
            :reduce="(role) => role.id"
            :options="optionRoles"
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
          <b-form-input v-model="filter" placeholder="Tìm kiếm người dùng" />
        </b-input-group>
      </b-col>
      <b-col class="d-flex justify-content-end" cols="12" md="4">
        <b-button variant="primary" @click="openModalAdd(null)">
          <feather-icon icon="PlusIcon" /> Thêm người dùng
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
      :per-page="perPage"
      :current-page="currentPage"
      :busy="isBusy"
      :filter="filter"
    >
      <!-- A virtual column -->
      <template #cell(name)="data">
        <div class="d-flex align-items-center">
          <b-avatar size="lg" :src="data.item.avatar" />
          <div class="pl-2 d-flex flex-column">
            <span class="">
              {{ data.item.name }}
            </span>
            <span>{{ data.item.email }}</span>
          </div>
        </div>
      </template>
      <template #cell(subject)="data">
        {{ data.value.name }}
      </template>
      <template #cell(role)="data">
        <b-badge v-if="data.value === 'ADMIN'" variant="light-dark">
          Admin
        </b-badge>
        <b-badge v-if="data.value === 'MINISTRY'" variant="light-info">
          Giáo vụ
        </b-badge>
        <b-badge v-if="data.value === 'STAFF'" variant="light-primary">
          Nhân viên
        </b-badge>
      </template>
      <template #cell(action)="data">
        <b-button
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          variant="gradient-info"
          class="btn-icon rounded-circle"
          @click="openModalAdd(data.item)"
        >
          <feather-icon icon="EditIcon" />
        </b-button>
        <b-button
          v-if="data.item.isActive"
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          variant="gradient-danger"
          class="btn-icon rounded-circle ml-1"
          @click="deleteContent(data.item._id)"
        >
          <feather-icon icon="LockIcon" />
        </b-button>
        <b-button
          v-if="!data.item.isActive"
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          variant="success"
          class="btn-icon rounded-circle ml-1"
          @click="deleteContent(data.item._id)"
        >
          <feather-icon icon="UnlockIcon" />
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
    <!-- Pagination -->
    <div class="d-flex justify-content-between align-items-center">
      <b-form-group class="mb-0">
        <label class="d-inline-block text-sm-left mr-50"
          >Số dòng trên trang</label
        >
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
    <!-- Modal add or edit user -->
    <modal-add-user
      :is-visible="isVisibleModalAdd"
      :data-edit="dataEdit"
      @close-modal-add="closeModalAdd"
      @reload-data="getAllUser"
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
  BPagination,
  BFormSelect,
  BAvatar,
  BFormGroup,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import vSelect from 'vue-select'
import userServices from '@/services/user'
import ModalAddUser from './ModalAddUser.vue'

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
    BAvatar,
    vSelect,
    ModalAddUser,
    BPagination,
    BFormSelect,
  },
  directives: {
    'b-tooltip': VBTooltip,
    Ripple,
  },
  data() {
    return {
      fields: [
        { key: 'userId', label: 'Mã người dùng' },
        { key: 'name', label: 'Tên người dùng' },
        { key: 'subject', label: 'Bộ môn' },
        { key: 'phone', label: 'Số điện thoại' },
        { key: 'address', label: 'Địa chỉ' },
        { key: 'role', label: 'Quyền' },
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
      optionRoles: [
        {
          id: '',
          name: 'Tất cả',
        },
        {
          id: 'STAFF',
          name: 'Giảng viên',
        },
        {
          id: 'MINISTRY',
          name: 'Giáo vụ',
        },
        {
          id: 'ADMIN',
          name: 'Quản trị',
        },
      ],
      selectedRole: '',
      dataEdit: null,
      perPage: 5,
      pageOptions: [5, 10, 15],
      totalRows: 1,
      currentPage: 1,
      filter: null,
    }
  },
  watch: {
    // when selected role changed, update the table by role
    selectedRole() {
      this.getAllUser(this.selectedRole)
    },
  },
  created() {
    this.getAllUser()
  },
  methods: {
    // Get list user into table
    async getAllUser(role) {
      this.isBusy = true
      try {
        const res = await userServices.getUsers({ role })
        this.items = res.data.data.users
        this.totalRows = this.items.length
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
      } finally {
        this.isBusy = false
      }
    },
    // Open modal add or edit user
    openModalAdd(data) {
      if (data) {
        this.dataEdit = {
          // eslint-disable-next-line no-underscore-dangle
          _id: data._id,
          userId: data.userId,
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          role: data.role,
          // eslint-disable-next-line no-underscore-dangle
          department: data.department._id,
          // eslint-disable-next-line no-underscore-dangle
          subject: data.subject._id,
        }
      } else {
        this.dataEdit = null
      }
      this.isVisibleModalAdd = true
    },
    // Close modal add or edit user
    closeModalAdd() {
      this.isVisibleModalAdd = false
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
