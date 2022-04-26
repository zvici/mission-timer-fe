<template>
  <b-modal
    :visible="isVisible"
    centered
    :title="`${semester ? 'Cập nhật' : 'Thêm'} học kỳ`"
    :hide-footer="true"
    @hide="onClose"
  >
    <validation-observer ref="refFormObserver">
      <b-form @submit.prevent>
        <validation-provider #default="{ errors }" name="name" rules="required">
          <b-form-group>
            <label>Năm học:</label>
            <b-form-select v-model="form.year" :options="yearOptions">
              <small class="text-danger">{{ errors[0] }}</small>
            </b-form-select></b-form-group
          >
          <b-form-group>
            <label>Tên học kỳ:</label>
            <b-form-input
              v-model="form.name"
              :state="errors.length > 0 ? false : null"
              autofocus
              placeholder="Nhập tên học kỳ"
            />
            <small class="text-danger">{{
              errors[0] && 'Vui lòng nhập nội dung'
            }}</small>
          </b-form-group>

          <b-form-group>
            <label>Ngày bắt đầu:</label>
            <b-form-datepicker
              v-model="form.startDate"
              :state="errors.length > 0 ? false : null"
            />
            <small class="text-danger">{{ errors[0] }}</small>
          </b-form-group>
        </validation-provider>

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
              {{ semester ? 'Cập nhật' : 'Thêm' }} học kỳ
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
  BFormDatepicker,
  BFormSelect,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { required } from '@validations'
import getDiffObject from '../../utils/getDiffObject'

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
    BFormDatepicker,
    BFormSelect,
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
    semester: {
      type: Object,
      default() {
        return {}
      },
    },
    years: {
      type: Array,
      default() {
        return []
      },
    },
  },

  data() {
    return {
      form: {
        name: '',
        startDate: '',
        year: '',
      },
      initform: {
        name: '',
        startDate: '',
        year: '',
      },
      isBusy: false,
      required,
    }
  },

  computed: {
    yearOptions() {
      if (!this.years) return []

      // eslint-disable-next-line no-underscore-dangle
      const options = this.years.map((item) => ({
        // eslint-disable-next-line no-underscore-dangle
        value: item._id,
        text: item.name,
      }))

      return options
    },
  },

  watch: {
    $props: {
      handler() {
        if (!this.semester) {
          this.form = {
            name: '',
            startDate: '',
            year: '',
          }
        } else {
          this.form = this.semester
        }
      },
      deep: true,
      immediate: true,
    },

    isVisible() {
      this.initform = { ...this.form }
    },
  },

  methods: {
    onClose() {
      this.$emit('close-semester-modal')
    },

    onClearForm() {
      this.form = {
        title: '',
        description: '',
      }
    },

    validationForm() {
      this.$refs.refFormObserver.validate().then(() => {
        if (!this.semester) {
          const { name, year, startDate } = this.form

          const payload = { name, year, startDate }

          if (!payload) return

          this.$emit('create-semester', payload)
        } else {
          const payload = getDiffObject(this.form, this.initform)

          if (!payload) return

          this.$emit('update-semester', payload)
        }
      })
    },
  },
}
</script>
