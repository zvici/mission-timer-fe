<template>
  <b-modal
    :visible="isVisible"
    centered
    :title="`${dataEdit ? 'Cập nhật' : 'Thêm'} chi tiết nội dung công tác`"
    :hide-footer="true"
    @hide="onClose"
  >
    <validation-observer ref="refFormObserver">
      <b-form @submit.prevent>
        <validation-provider
          #default="{ errors }"
          name="Nội dung"
          rules="required"
        >
          <b-form-group>
            <label>Nội dung công tác</label>
            <v-select
              v-model="form.content"
              :state="errors.length > 0 ? false : null"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              label="title"
              :reduce="(content) => content._id"
              :options="optionContents"
            />
            <small class="text-danger">{{
              errors[0] && 'Vui lòng chọn nội dung'
            }}</small>
          </b-form-group>
        </validation-provider>
        <validation-provider
          #default="{ errors }"
          name="Title"
          rules="required"
        >
          <b-form-group>
            <label>Tiêu đề</label>
            <b-form-input
              v-model="form.title"
              :state="errors.length > 0 ? false : null"
              placeholder="Nhập tiêu đề"
            />
            <small class="text-danger">{{
              errors[0] && 'Vui lòng nhập tiêu đề'
            }}</small>
          </b-form-group>
        </validation-provider>
        <validation-provider #default="{ errors }" name="Loại" rules="required">
          <b-form-group>
            <label>Loại chi tiết nội dung công tác</label>
            <v-select
              v-model="form.type"
              :state="errors.length > 0 ? false : null"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              label="name"
              :reduce="(type) => type.id"
              :options="optionTypes"
            />
            <small class="text-danger">{{
              errors[0] && 'Vui lòng loại nội dung'
            }}</small>
          </b-form-group>
        </validation-provider>
        <validation-provider
          #default="{ errors }"
          name="Định mức"
          rules="required"
        >
          <b-form-group>
            <label>Định mức theo quy định</label>
            <b-form-input
              v-model="form.quota"
              :state="errors.length > 0 ? false : null"
              placeholder="Nhập định mức theo quy định"
            />
            <small class="text-danger">{{
              errors[0] && 'Vui lòng nhập định mức theo quy định'
            }}</small>
          </b-form-group>
        </validation-provider>
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
              {{ dataEdit ? 'Cập nhật' : 'Thêm' }} chi tiết nội dung
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
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { required } from '@validations'
import vSelect from 'vue-select'
import activityServices from '@/services/actitvity'
import contentServices from '@/services/content'

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
        title: '',
        description: '',
        quota: '',
        content: '',
        type: '',
      },
      isBusy: false,
      required,
      optionContents: [],
      optionTypes: [
        {
          id: 'STAFF',
          name: 'Tự điểm danh',
        },
        {
          id: 'MINISTRY',
          name: 'Giáo vụ điểm danh',
        },
        {
          id: 'MONITOR_EXAM',
          name: 'Canh thi',
        },
      ],
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
      this.getContents()
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
        quota: '',
        content: '',
        type: '',
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
          res = await activityServices.updateActivities({
            // eslint-disable-next-line no-underscore-dangle
            id: this.dataEdit._id,
            ...this.form,
          })
        } else {
          res = await activityServices.createActivities(this.form)
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
    async getContents() {
      this.isBusy = true
      try {
        const res = await contentServices.getContens()
        this.optionContents = res.data.data.contents
      } catch (err) {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Thông báo',
            icon: 'BellIcon',
            text: err.response.data.message,
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
<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
