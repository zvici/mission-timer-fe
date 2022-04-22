<template>
  <b-modal
    :visible="isVisible"
    centered
    :title="`${dataEdit ? 'Cập nhật' : 'Thêm'} nội dung hoạt động`"
    :hide-footer="true"
    @hide="onClose"
  >
    <validation-observer ref="refFormObserver">
      <b-form @submit.prevent>
        <validation-provider
          #default="{ errors }"
          name="Title"
          rules="required"
        >
          <b-form-group>
            <label>Nội dung</label>
            <b-form-input
              v-model="form.title"
              :state="errors.length > 0 ? false : null"
              autofocus
              placeholder="Nhập nội dung"
            />
            <small class="text-danger">{{
              errors[0] && 'Vui lòng nhập nội dung'
            }}</small>
          </b-form-group>
        </validation-provider>
        <b-form-group>
          <label>Mô tả</label>
          <b-form-input
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
            <b-button
              variant="primary"
              type="submit"
              @click="validationForm"
            >
              {{ dataEdit ? 'Cập nhật' : 'Thêm' }}
            </b-button>
          </b-overlay>
          <b-button
            class="ml-1"
            variant="outline-primary"
            @click="onClose()"
          >
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
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { required } from '@validations'
import contentServices from '@/services/content'

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
        title: '',
        description: '',
      },
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
        title: '',
        description: '',
      }
    },
    validationForm() {
      this.$refs.refFormObserver.validate().then(success => {
        if (success) this.handleReq()
      })
    },
    async handleReq() {
      this.isBusy = true
      try {
        let res
        if (this.dataEdit) {
          res = await contentServices.updateContent({
            // eslint-disable-next-line no-underscore-dangle
            id: this.dataEdit._id,
            ...this.form,
          })
        } else {
          res = await contentServices.addContent(this.form)
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
