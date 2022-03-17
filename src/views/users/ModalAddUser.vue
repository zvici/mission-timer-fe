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
          :options="options"
        />
      </b-form-group>
      <b-form-group>
        <label>Khoa:</label>
        <b-form-select
          v-model="form.department"
          :options="options"
        />
      </b-form-group>
      <b-form-group>
        <label>Bộ môn:</label>
        <b-form-select
          v-model="form.subject"
          :options="options"
        />
      </b-form-group>
      <b-button
        variant="outline-primary"
        @click="onClose()"
      >
        Đóng
      </b-button>
      <b-button
        variant="success"
        type="submit"
      >
        Thêm
      </b-button>
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
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import departmentService from '@/services/department'

export default {
  components: {
    BForm,
    BFormGroup,
    BModal,
    BFormInput,
    BFormSelect,
    BButton,
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
      selected: null,
      options: [
        {
          value: 'cntt',
          text: 'Công nghệ thông tin',
        },
        {
          value: 'cntp',
          text: 'Công nghệ thực phẩm',
        },
      ],
    }
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
        console.log(res)
      } catch {
        console.log('lỗi rồi nè')
      }
    },
    onSubmit() {
      console.log(this.form)
    },
  },
}
</script>
