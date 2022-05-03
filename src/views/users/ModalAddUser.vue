<template>
  <b-modal
    :visible="isVisible"
    centered
    :title="`${dataEdit ? 'Cập nhật' : 'Thêm'} người dùng`"
    :hide-footer="true"
    @hide="onClose"
  >
    <validation-observer ref="refFormObserver">
      <b-form @submit.prevent>
        <validation-provider
          #default="{ errors }"
          name="Mã giảng viên"
          rules="required"
        >
          <b-form-group>
            <label>Mã giảng viên:</label>
            <b-form-input
              v-model="form.userId"
              placeholder="Nhập mã giảng viên"
              :state="errors.length > 0 ? false : null"
            />
            <small class="text-danger">{{
              errors[0] && 'Vui lòng nhập mã giảng viên'
            }}</small>
          </b-form-group>
        </validation-provider>
        <validation-provider
          #default="{ errors }"
          name="Họ tên"
          rules="required"
        >
          <b-form-group>
            <label>Họ và tên:</label>
            <b-form-input
              v-model="form.name"
              placeholder="Nhập họ và tên có dấu"
              :state="errors.length > 0 ? false : null"
            />
            <small class="text-danger">{{
              errors[0] && 'Vui lòng nhập họ và tên'
            }}</small>
          </b-form-group>
        </validation-provider>
        <validation-provider
          #default="{ errors }"
          name="Email"
          rules="required"
        >
          <b-form-group>
            <label>Email:</label>
            <b-form-input
              v-model="form.email"
              type="email"
              :state="errors.length > 0 ? false : null"
              placeholder="Nhập địa chỉ email"
            />
            <small class="text-danger">{{
              errors[0] && 'Vui lòng email'
            }}</small>
          </b-form-group>

        </validation-provider>
        <validation-provider
          #default="{ errors }"
          name="Số điện thoại"
          rules="required"
        >
          <b-form-group>
            <label>Số điện thoại:</label>
            <b-form-input
              v-model="form.phone"
              placeholder="Nhập số điện thoại"
              :state="errors.length > 0 ? false : null"
            />
            <small class="text-danger">{{
              errors[0] && 'Vui lòng nhập số điện thoại'
            }}</small>
          </b-form-group>
        </validation-provider>
        <validation-provider
          #default="{ errors }"
          name="Địa chỉ"
          rules="required"
        >
          <b-form-group>
            <label>Địa chỉ:</label>
            <b-form-input
              v-model="form.address"
              placeholder="Nhập địa chỉ"
              :state="errors.length > 0 ? false : null"
            />
            <small class="text-danger">{{
              errors[0] && 'Vui lòng nhập địa chỉ'
            }}</small>
          </b-form-group>
        </validation-provider>
        <validation-provider
          #default="{ errors }"
          name="Quyền"
          rules="required"
        >
          <b-form-group>
            <label>Quyền:</label>
            <v-select
              v-model="form.role"
              label="text"
              :state="errors.length > 0 ? false : null"
              :reduce="role => role.value"
              :options="optionsRole"
            />
            <small class="text-danger">{{
              errors[0] && 'Vui lòng chọn quyền'
            }}</small>
          </b-form-group>
        </validation-provider>
        <validation-provider
          #default="{ errors }"
          name="Khoa"
          rules="required"
        >
          <b-form-group>
            <label>Khoa:</label>
            <v-select
              v-model="form.department"
              label="name"
              :reduce="department => department._id"
              :state="errors.length > 0 ? false : null"
              :options="optionsDepartment"
            />
            <small class="text-danger">{{
              errors[0] && 'Vui lòng chọn khoa'
            }}</small>
          </b-form-group>
        </validation-provider>
        <validation-provider
          #default="{ errors }"
          name="Bộ môn"
          rules="required"
        >
          <b-form-group>
            <label>Bộ môn:</label>
            <v-select
              v-model="form.subject"
              label="name"
              :reduce="subject => subject._id"
              :state="errors.length > 0 ? false : null"
              :options="optionsSubject"
            />
            <small class="text-danger">{{
              errors[0] && 'Vui lòng chọn bộ môn'
            }}</small>
          </b-form-group>
        </validation-provider>
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
              @click="validationForm"
            >
              {{ dataEdit ? 'Cập nhật' : 'Thêm' }} người dùng
            </b-button>
          </b-overlay>
        </div>
        </validation-provider></b-form>
    </validation-observer>
  </b-modal>
</template>
<script>
import {
  BForm,
  BFormGroup,
  BModal,
  BFormInput,
  VBTooltip,
  BButton,
  BOverlay,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { required } from '@validations'
import departmentService from '@/services/department'
import userServices from '@/services/user'
import subjectServices from '@/services/subject'

export default {
  components: {
    BForm,
    BFormGroup,
    BModal,
    BFormInput,
    BButton,
    BOverlay,
    ValidationProvider,
    ValidationObserver,
    vSelect,
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
    dataEdit: {
      type: Object,
      default() {
        return {}
      },
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
      optionsSubject: [],
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
      required,
    }
  },
  computed: {
    dataEditAndisVisible() {
      return `${this.dataEdit}|${this.isVisible}`
    },
  },
  watch: {
    isVisible() {
      if (this.isVisible) {
        this.getDepartments()
      }
    },
    // eslint-disable-next-line func-names
    'form.department': function () {
      this.getSubjects(this.form.department)
    },
    dataEditAndisVisible() {
      if (this.dataEdit) {
        this.form = { ...this.dataEdit }
      } else this.onClearForm()
      this.getContents()
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
    async getSubjects(department) {
      try {
        const res = await subjectServices.getSubjects(department)
        this.optionsSubject = res.data.data.subjects
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
    validationForm() {
      this.$refs.refFormObserver.validate().then(success => {
        if (success) {
          if (this.dataEdit) {
            this.onUpdateUser()
          } else {
            this.onAddUser()
          }
        }
      })
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
    async onUpdateUser() {
      this.isBusy = true
      try {
        const res = await userServices.updateUser(this.form)
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
        this.onClose()
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
