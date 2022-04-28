<template>
  <div>
    <b-sidebar
      id="sidebar-add-new-event"
      sidebar-class="sidebar-lg"
      :visible="isEventHandlerSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-event-handler-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <!-- Header -->
        <div
          class="
            d-flex
            justify-content-between
            align-items-center
            content-sidebar-header
            px-2
            py-1
          "
        >
          <h5 class="mb-0">
            {{ eventLocal.id ? 'Cập nhật' : 'Thêm' }} công việc
          </h5>
          <div>
            <feather-icon
              v-if="eventLocal.id"
              icon="EyeIcon"
              class="cursor-pointer"
              @click="openModalAdd()"
            />
            <feather-icon
              v-if="eventLocal.id"
              icon="TrashIcon"
              class="cursor-pointer ml-2"
              @click="$emit('remove-event').hide()"
            />
            <feather-icon
              class="ml-1 cursor-pointer"
              icon="XIcon"
              size="16"
              @click="hide"
            />
          </div>
        </div>

        <!-- Body -->
        <validation-observer #default="{ handleSubmit }" ref="refFormObserver">
          <!-- Form -->
          <b-form
            class="p-2"
            @submit.prevent="handleSubmit(onSubmit)"
            @reset.prevent="resetForm"
          >
            <!-- Semester -->
            <validation-provider
              #default="validationContext"
              name="Semester"
              rules="required"
            >
              <b-form-group
                label="Học kỳ"
                label-for="Semester"
                :state="getValidationState(validationContext)"
              >
                <v-select
                  v-model="eventLocal.extendedProps.semester"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="semesterOptions"
                  label="name"
                  :reduce="(semester) => semester._id"
                  input-id="_id"
                >
                  <template #option="{ name, year }">
                    <span>{{ name }} - {{ year.name }}</span>
                  </template>
                  <template #selected-option="{ name, year }">
                    <span>{{ name }} - {{ year.name }}</span>
                  </template>
                </v-select>

                <b-form-invalid-feedback
                  :state="getValidationState(validationContext)"
                >
                  {{ validationContext.errors[0] }}
                </b-form-invalid-feedback>
              </b-form-group>
            </validation-provider>
            <!-- Activity -->
            <validation-provider
              #default="validationContext"
              name="Activity"
              rules="required"
            >
              <b-form-group
                label="Hoạt động"
                label-for="Activity"
                :state="getValidationState(validationContext)"
              >
                <v-select
                  v-model="eventLocal.extendedProps.activity"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="activityOptions"
                  label="title"
                  :reduce="(activity) => activity._id"
                  input-id="_id"
                >
                </v-select>

                <b-form-invalid-feedback
                  :state="getValidationState(validationContext)"
                >
                  {{ validationContext.errors[0] }}
                </b-form-invalid-feedback>
              </b-form-group>
            </validation-provider>
            <div v-if="quotaStr" class="mb-1">
              <label>Thông tin hoạt động</label>
              <p>Định mức: {{ quotaStr }}</p>
            </div>
            <!-- Title -->
            <validation-provider
              #default="validationContext"
              name="title"
              rules="required"
            >
              <b-form-group label="Mô tả" label-for="event-title">
                <b-form-textarea
                  id="event-title"
                  v-model="eventLocal.title"
                  autofocus
                  :state="getValidationState(validationContext)"
                  trim
                  placeholder="Nhập mô tả"
                />

                <b-form-invalid-feedback>
                  {{ validationContext.errors[0] }}
                </b-form-invalid-feedback>
              </b-form-group>
            </validation-provider>
            <!-- Start Date -->
            <validation-provider
              #default="validationContext"
              name="Start Date"
              rules="required"
            >
              <b-form-group
                label="Ngày bắt đầu"
                label-for="start-date"
                :state="getValidationState(validationContext)"
              >
                <flat-pickr
                  :maxDate="eventLocal.end"
                  v-model="eventLocal.start"
                  class="form-control"
                  :config="{ enableTime: true, dateFormat: 'Y-m-d H:i' }"
                />
                <b-form-invalid-feedback
                  :state="getValidationState(validationContext)"
                >
                  {{ validationContext.errors[0] }}
                </b-form-invalid-feedback>
              </b-form-group>
            </validation-provider>

            <!-- End Date -->
            <validation-provider #default="validationContext" name="End Date">
              <b-form-group
                label="Ngày kết thúc"
                label-for="end-date"
                :state="getValidationState(validationContext)"
              >
                <flat-pickr
                  :minDate="eventLocal.start"
                  v-model="eventLocal.end"
                  class="form-control"
                  :config="{ enableTime: true, dateFormat: 'Y-m-d H:i' }"
                />
                <b-form-invalid-feedback
                  :state="getValidationState(validationContext)"
                >
                  {{ validationContext.errors[0] }}
                </b-form-invalid-feedback>
              </b-form-group>
            </validation-provider>

            <validation-provider
              #default="validationContext"
              name="officeHours"
              rules="required"
            >
              <b-form-group
                label="Số giờ định mức đạt được"
                label-for="event-title"
              >
                <b-form-input
                  type="number"
                  v-model="eventLocal.extendedProps.officeHours"
                  autofocus
                  :state="getValidationState(validationContext)"
                  trim
                  placeholder="Nhập số giờ đạt cho mỗi người được khi hoàn thành công việc này"
                />

                <b-form-invalid-feedback>
                  {{ validationContext.errors[0] }}
                </b-form-invalid-feedback>
              </b-form-group>
            </validation-provider>
            <!-- Participants -->
            <validation-provider
              #default="validationContext"
              name="Participants"
              rules="required"
            >
              <b-form-group
                label="Người tham gia"
                label-for="Participants"
                :state="getValidationState(validationContext)"
              >
                <v-select
                  multiple
                  v-model="eventLocal.extendedProps.participants"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="participantsOptions"
                  label="name"
                  :reduce="(user) => user._id"
                  input-id="_id"
                >
                  <template #option="{ name, userId, avatar }">
                    <div class="d-flex align-items-center">
                      <b-avatar
                        :src="avatar"
                        size="1.3rem"
                        class="mr-1"
                      ></b-avatar>
                      <span>{{ userId }} - {{ name }}</span>
                    </div>
                  </template>
                  <template #selected-option="{ name, userId, avatar }">
                    <div class="d-flex align-items-center">
                      <b-avatar
                        :src="avatar"
                        size="1.3rem"
                        class="mr-1"
                      ></b-avatar>
                      <span>{{ userId }} - {{ name }}</span>
                    </div>
                  </template>
                </v-select>

                <b-form-invalid-feedback
                  :state="getValidationState(validationContext)"
                >
                  {{ validationContext.errors[0] }}
                </b-form-invalid-feedback>
              </b-form-group>
            </validation-provider>
            <!-- Form Actions -->
            <div class="d-flex mt-2">
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                variant="primary"
                class="mr-2"
                type="submit"
              >
                {{ eventLocal.id ? 'Lưu' : 'Thêm' }} hoạt động
              </b-button>
              <b-button
                v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                type="reset"
                variant="outline-secondary"
              >
                Làm mới
              </b-button>
            </div>
          </b-form>
        </validation-observer>
      </template>
    </b-sidebar>
    <detail-modal
      v-if="eventLocal.id"
      :is-visible="isVisibleModalAdd"
      :id-event="eventLocal.id"
      @close-modal-add="closeModalAdd"
    />
  </div>
</template>

<script>
import {
  BSidebar,
  BForm,
  BFormGroup,
  BFormInput,
  BFormTextarea,
  BButton,
  BFormInvalidFeedback,
  BAvatar,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component'
import { Vietnamese } from 'flatpickr/dist/l10n/vn.js'

import Ripple from 'vue-ripple-directive'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { required, email, url } from '@validations'
import formValidation from '@core/comp-functions/forms/form-validation'
import { ref, toRefs } from '@vue/composition-api'
import useCalendarEventHandler from './useCalendarEventHandler'
import DetailModal from '../detail-modal/DetailModal.vue'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import semesterServices from '@/services/semester'
import activityServices from '@/services/actitvity'
import userServices from '@/services/user'

// default locale is now Vietnamese
flatpickr.localize(Vietnamese)

export default {
  components: {
    BButton,
    BSidebar,
    BForm,
    BFormGroup,
    BFormInput,
    BFormTextarea,
    BAvatar,
    vSelect,
    flatPickr,
    ValidationProvider,
    BFormInvalidFeedback,
    ValidationObserver,
    DetailModal,
  },
  directives: {
    Ripple,
  },
  model: {
    prop: 'isEventHandlerSidebarActive',
    event: 'update:is-event-handler-sidebar-active',
  },
  props: {
    isEventHandlerSidebarActive: {
      type: Boolean,
      required: true,
    },
    event: {
      type: Object,
      required: true,
    },
    clearEventData: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      required,
      email,
      url,
      semesterOptions: [],
      activityOptions: [],
      participantsOptions: [],
      isVisibleModalAdd: false,
    }
  },
  created() {
    this.getSemester()
    this.getActivities()
    this.getStaff()
  },
  computed: {
    quotaStr() {
      if (
        this.eventLocal.extendedProps.activity &&
        this.activityOptions.length > 0
      ) {
        return this.activityOptions.find(
          (activity) => activity._id === this.eventLocal.extendedProps.activity
        ).quota
      }
      return false
    },
  },
  methods: {
    openModalAdd() {
      this.isVisibleModalAdd = true
    },
    closeModalAdd() {
      this.isVisibleModalAdd = false
    },
    // get semester
    async getSemester(year) {
      try {
        const res = await semesterServices.getAll({ year })
        this.semesterOptions = res.data.data.semesters
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
    // get semester
    async getActivities(content) {
      try {
        const res = await activityServices.getActivities({ content })
        this.activityOptions = res.data.data.activities
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
    // set staff
    async getStaff() {
      try {
        const res = await userServices.getUsers({ role: 'STAFF' })
        this.participantsOptions = res.data.data.users
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
  },
  //
  setup(props, { emit }) {
    /*
     ? This is handled quite differently in SFC due to deadlock of `useFormValidation` and this composition function.
     ? If we don't handle it the way it is being handled then either of two composition function used by this SFC get undefined as one of it's argument.
     * The Trick:

     * We created reactive property `clearFormData` and set to null so we can get `resetEventLocal` from `useCalendarEventHandler` composition function.
     * Once we get `resetEventLocal` function which is required by `useFormValidation` we will pass it to `useFormValidation` and in return we will get `clearForm` function which shall be original value of `clearFormData`.
     * Later we just assign `clearForm` to `clearFormData` and can resolve the deadlock. 😎

     ? Behind The Scene
     ? When we passed it to `useCalendarEventHandler` for first time it will be null but right after it we are getting correct value (which is `clearForm`) and assigning that correct value.
     ? As `clearFormData` is reactive it is being changed from `null` to corrent value and thanks to reactivity it is also update in `useCalendarEventHandler` composition function and it is getting correct value in second time and can work w/o any issues.
    */
    const clearFormData = ref(null)

    const {
      eventLocal,
      resetEventLocal,
      calendarOptions,

      // UI
      onSubmit,
      guestsOptions,
    } = useCalendarEventHandler(toRefs(props), clearFormData, emit)

    const { refFormObserver, getValidationState, resetForm, clearForm } =
      formValidation(resetEventLocal, props.clearEventData)

    clearFormData.value = clearForm

    return {
      // Add New Event
      eventLocal,
      calendarOptions,
      onSubmit,
      guestsOptions,

      // Form Validation
      resetForm,
      refFormObserver,
      getValidationState,
    }
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
@import '@core/scss/vue/libs/vue-flatpicker.scss';
</style>
