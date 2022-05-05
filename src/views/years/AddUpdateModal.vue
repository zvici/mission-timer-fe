<template>
  <b-modal
    :visible="isVisible"
    centered
    :title="`${dataEdit ? 'Cập nhật' : 'Thêm'} năm học`"
    :hide-footer="true"
    @hide="onClose"
  >
    <validation-observer ref="refFormObserver">
      <b-form @submit.prevent>
        <validation-provider
          #default="{ errors }"
          name="Ngày bắt đầu"
          rules="required"
        >
          <b-form-group>
            <label>Ngày bắt đầu</label>
            <b-form-datepicker
              v-model="form.startDate"
              :min="form.endDate"
              locale="vi"
              :state="errors.length > 0 ? false : null"
            />
            <small class="text-danger">{{
              errors[0] && 'Vui lòng chọn ngày bắt đầu'
            }}</small>
          </b-form-group>
        </validation-provider>
        <b-form-group>
          <label>Ngày kết thúc</label>
          <b-form-datepicker
            v-model="form.endDate"
            locale="vi"
            :min="form.startDate"
          />
        </b-form-group>
        <b-form-group>
          <label>Mô tả</label>
          <b-form-textarea
            v-model="form.description"
            placeholder="Nhập mô tả"
          />
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
              {{ dataEdit ? 'Cập nhật' : 'Thêm' }} năm học
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
import yearServices from '@/services/year'

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
        startDate: '',
        endDate: '',
        description: '',
      },
      optionYears: [],
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
        startDate: '',
        endDate: '',
        description: '',
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
          res = await yearServices.update({
            // eslint-disable-next-line no-underscore-dangle
            id: this.dataEdit._id,
            ...this.form,
          })
        } else {
          res = await yearServices.create(this.form)
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
            text: err.response?.data.message ? err.response?.data.message : err.toString(),
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
