<template>
  <b-modal
    :visible="isVisible"
    centered
    :title="`${dataEdit ? 'Cập nhật' : 'Thêm'} khoa`"
    :hide-footer="true"
    @hide="onClose"
  >
    <validation-observer ref="refFormObserver">
      <b-form @submit.prevent>
        <!-- Name -->
        <validation-provider #default="{ errors }" name="Tên" rules="required">
          <b-form-group>
            <label>Tên khoa</label>
            <b-form-input
              v-model="form.name"
              :state="errors.length > 0 ? false : null"
              placeholder="Nhập tên khoa"
            />
            <small class="text-danger">{{
              errors[0] && 'Vui lòng nhập tên khoa'
            }}</small>
          </b-form-group>
        </validation-provider>
        <!-- Description -->
        <b-form-group>
          <label>Mô tả</label>
          <b-form-textarea
            v-model="form.description"
            placeholder="Nhập mô tả"
          />
        </b-form-group>
        <!-- Email -->
        <b-form-group>
          <label>Email</label>
          <b-form-input v-model="form.email" placeholder="Nhập email" />
        </b-form-group>
        <!-- Email -->
        <b-form-group>
          <label>Số điện thoại</label>
          <b-form-input v-model="form.phone" placeholder="Nhập số điện thoại" />
        </b-form-group>

        <div class="d-flex justify-content-end">
          <b-overlay
            :show="isBusy"
            rounded
            opacity="0.6"
            spinner-small
            spinner-variant="primary"
            class="d-inline-block"
          >
            <b-button variant="primary" type="submit" @click="validationForm">
              {{ dataEdit ? 'Cập nhật' : 'Thêm' }} khoa
            </b-button>
          </b-overlay>
          <b-button class="ml-1" variant="outline-primary" @click="onClose()">
            Đóng
          </b-button>
        </div>
      </b-form>
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
  BFormTextarea,
  BFormDatepicker,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { required } from '@validations'
import vSelect from 'vue-select'
import departmentServices from '@/services/department'

export default {
  components: {
    BForm,
    BFormGroup,
    BModal,
    BFormInput,
    BFormTextarea,
    BButton,
    BOverlay,
    ValidationProvider,
    ValidationObserver,
    BFormDatepicker,
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
        description: '',
        email: '',
        phone: '',
      },
      optionDepartments: [],
      isBusy: false,
      required,
    }
  },
  computed: {
    dataEditAndisVisible() {
      return `${this.dataEdit}|${this.isVisible}`
    },
  },
  watch: {
    dataEditAndisVisible() {
      if (this.dataEdit) {
        this.form = { ...this.dataEdit }
      } else this.onClearForm()
    },
  },
  methods: {
    onClose() {
      this.$emit('close-modal-add')
    },
    onClearForm() {
      this.form = {
        name: '',
        description: '',
        email: '',
        phone: '',
      }
    },
    validationForm() {
      this.$refs.refFormObserver.validate().then((success) => {
        if (success) this.handleReq()
      })
    },
    async handleReq() {
      this.isBusy = true
      try {
        let res
        if (this.dataEdit) {
          res = await departmentServices.update({
            // eslint-disable-next-line no-underscore-dangle
            id: this.dataEdit._id,
            ...this.form,
          })
        } else {
          res = await departmentServices.create(this.form)
        }
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Thông báo',
            icon: 'BellIcon',
            text: res.data.message,
            variant: 'success',
          },
        })
        this.onClearForm()
        this.onClose()
        this.$emit('reload-data')
      } catch (err) {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Thông báo',
            icon: 'BellIcon',
            text: err.response?.data.message
              ? err.response.data.message
              : err.toString(),
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
