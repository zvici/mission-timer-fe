<template>
  <b-modal
    :visible="isVisible"
    centered
    title="Thêm năm học"
    :hide-footer="true"
    @hide="onClose"
  >
    <validation-observer ref="addRules">
      <b-form>
        <b-form-group>
          <label>Ngày bắt đầu:</label>
          <validation-provider
            #default="{ errors }"
            name="startDate"
            rules="required"
          >
            <b-form-datepicker
              v-model="form.startDate"
              :state="errors.length > 0 ? false : null"
            />
            <small class="text-danger">{{ errors[0] }}</small>
          </validation-provider>
        </b-form-group>
        <b-form-group>
          <label>Ngày kết thúc</label>
          <b-form-datepicker
            v-model="form.endDate"
          />
        </b-form-group>
        <b-form-group>
          <label>Ghi chú:</label>
          <b-form-input
            v-model="form.description"
            placeholder="Ghi chú"
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
              @click.prevent="onSubmit()"
            >
              Thêm
            </b-button>
          </b-overlay>
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
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { required } from '@validations'
import moment from 'moment'
import yearServices from '@/services/year'

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    BForm,
    BFormGroup,
    BModal,
    BFormInput,
    BButton,
    BOverlay,
    BFormDatepicker,
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
        startDate: undefined,
        endDate: undefined,
        description: undefined,
      },
      isBusy: false,
      required,
    }
  },
  methods: {
    onClose() {
      this.$emit('close-modal-add')
    },
    onSubmit() {
      this.$refs.addRules.validate().then(success => {
        if (success) {
          this.onAddYear()
        }
      })
    },
    onClear() {
      this.form = {
        startDate: '',
        endDate: '',
        description: '',
      }
    },
    async onAddYear() {
      this.isBusy = true
      const { startDate, endDate, description } = this.form
      try {
        const res = await yearServices.addYear({
          startDate: moment(startDate, 'YYYY-MM-DD')
            .format('DD-MM-YYYY')
            .toString(),
          endDate: endDate && moment(endDate, 'YYYY-MM-DD')
            .format('DD-MM-YYYY')
            .toString(),
          description,
        })
        console.log(res)
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Thông báo',
            icon: 'BellIcon',
            text: 'Thêm thành công',
            variant: 'success',
          },
        })
        this.$emit('reload-data')
        this.onClear()
        this.onClose()
      } catch {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Thông báo',
            icon: 'BellIcon',
            text: 'Loi',
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
