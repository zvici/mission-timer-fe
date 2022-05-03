<template>
  <b-modal
    :visible="isVisible"
    centered
    title="Thêm người dùng"
    :hide-footer="true"
    @hide="onClose"
  >
    <b-form @submit.prevent="onSubmit">
      <b-form-group>
        <label>Mã giảng viên:</label>
        <b-form-input
          v-model="form.userId"
          placeholder="Nhập mã giảng viên"
        />
      </b-form-group>
      <b-form-group>
        <label>Họ và tên:</label>
        <b-form-input
          v-model="form.name"
          placeholder="Nhập họ và tên có dấu"
        />
      </b-form-group>
      <b-form-group>
        <label>Email:</label>
        <b-form-input
          v-model="form.email"
          type="email"
          placeholder="Nhập địa chỉ email"
        />
      </b-form-group>
      <b-form-group>
        <label>Số điện thoại:</label>
        <b-form-input
          v-model="form.phone"
          placeholder="Nhập số điện thoại"
        />
      </b-form-group>
      <b-form-group>
        <label>Địa chỉ:</label>
        <b-form-input
          v-model="form.address"
          placeholder="Nhập địa chỉ"
        />
      </b-form-group>
      <b-form-group>
        <label>Quyền:</label>
        <b-form-select
          v-model="form.role"
          :options="optionsRole"
        />
      </b-form-group>
      <b-form-group>
        <label>Khoa:</label>
        <b-form-select
          v-model="form.department"
          :options="optionsDepartment"
          value-field="_id"
          text-field="name"
        />
      </b-form-group>
      <b-form-group>
        <label>Bộ môn:</label>
        <b-form-select
          v-model="form.subject"
          :options="options"
        />
      </b-form-group>
      <div class="d-flex justify-content-end">
        <b-button
          variant="outline-primary"
          @click="onClose()"
        >
          Đóng
        </b-button>
        <b-overlay
          :show="isBusy"
          rounded
          opacity="0.6"
          spinner-small
          spinner-variant="primary"
          class="d-inline-block"
        >
          <b-button
            class="ml-1"
            variant="success"
            type="submit"
          >
            Thêm
          </b-button>
        </b-overlay>
      </div>
    </b-form>
  </b-modal>
</template>
<script>
import {
  BForm,
  BFormGroup,
  BModal,
  BFormInput,
  VBTooltip,
  BFormSelect,
  BButton,
  BOverlay,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import departmentService from '@/services/department'
import userServices from '@/services/user'

export default {
  components: {
    BForm,
    BFormGroup,
    BModal,
    BFormInput,
    BFormSelect,
    BButton,
    BOverlay,
  },
  directives: {
    'b-tooltip': VBTooltip,
    Ripple,
  },
  props: {
    isVisible: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      form: {
        name: '',
        userId: '',
        email: '',
        phone: '',
        department: '',
        subject: '',
        role: '',
        address: '',
      },
      isBusy: false,
      selected: null,
      optionsDepartment: [],
      optionsRole: [
        {
          value: 'ADMIN',
          text: 'Admin',
        },
        {
          value: 'MINISTRY',
          text: 'Giáo vụ',
        },
        {
          value: 'STAFF',
          text: 'Giảng viên',
        },
      ],
    }
  },
  watch: {
    isVisible() {
      if (this.isVisible) {
        this.getDepartments()
      }
    },
  },
  destroyed() {
    this.selected = null
  },
  methods: {
    onClose() {
      this.$emit('close-modal-add')
    },
    async getDepartments() {
      try {
        const res = await departmentService.getDepartments()
        this.optionsDepartment = res.data.data.departments
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
    onSubmit() {
      this.onAddUser()
    },
    onClear() {
      this.form = {
        name: '',
        userId: '',
        email: '',
        phone: '',
        department: '',
        // subject: '',
        role: '',
        address: '',
      }
    },
    async onAddUser() {
      this.isBusy = true
      try {
        const res = await userServices.addUser(this.form)
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Thông báo',
            icon: 'BellIcon',
            text: res.data.message,
            variant: 'success',
          },
        })
        this.$emit('reload-data')
        this.onClear()
      } catch (e) {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Thông báo',
            icon: 'BellIcon',
            text: e,
            variant: 'warning',
          },
        })
      } finally {
        this.isBusy = false
      }
    },
  },
}
</script>
