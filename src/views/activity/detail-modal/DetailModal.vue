<template>
  <b-modal
    size="xl"
    :visible="isVisible"
    centered
    title="Chi tiết hoạt động"
    :hide-footer="true"
    @hide="onClose"
  >
    <b-row>
      <b-col cols="6">
        <b-form-group>
          <v-select
            v-model="selected"
            label="name"
            :reduce="user => user._id"
            :options="optionUser"
          >
            <template #option="{ name, userId, avatar }">
              <b-avatar
                variant="primary"
                size="2rem"
                :src="avatar"
                class="mr-1"
              />
              <span>{{ userId }} - {{ name }}</span>
            </template>
            <template #selected-option="{ name, userId, avatar }">
              <b-avatar
                variant="primary"
                size="2rem"
                :src="avatar"
                class="mr-1"
              />
              <span>{{ userId }} - {{ name }}</span>
            </template>
          </v-select>
        </b-form-group>
      </b-col>
      <b-col cols="6">
        <b-button
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          variant="primary"
          class=""
          @click="handleAddAssignee()"
        >
          Thêm người thực hiện
        </b-button>
      </b-col>
    </b-row>
    <b-table
      :items="items"
      :fields="fields"
      striped
      responsive
    >
      <template #cell(show_details)="row">
        <b-form-checkbox
          v-model="row.detailsShowing"
          plain
          class="vs-checkbox-con"
          @change="row.toggleDetails"
        >
          <span class="vs-checkbox">
            <span class="vs-checkbox--check">
              <i class="vs-icon feather icon-check" />
            </span>
          </span>
          <span class="vs-label">{{ row.detailsShowing ? 'Ẩn' : 'Hiện' }}</span>
        </b-form-checkbox>
      </template>
      <template #row-details="row">
        <b-card>
          <b-row class="mb-2">
            <b-col
              md="4"
              class="mb-1"
            >
              <strong>Nội dung : </strong>{{ row.item.description }}
            </b-col>
          </b-row>

          <b-button
            size="sm"
            variant="outline-secondary"
            @click="row.toggleDetails"
          >
            Ẩn chi tiết
          </b-button>
        </b-card>
      </template>
      <template #cell(fullname)="row">
        <span>{{ row.item.assignee.name }}</span>
      </template>
      <template #cell(quota)="data">
        <span>{{ data.value }} giờ</span>
      </template>
      <template #cell(avatar)="data">
        <b-avatar :src="data.value" />
      </template>
      <template #cell(status)="data">
        <b-badge :variant="status[1][data.value]">
          {{ status[0][data.value] }}
        </b-badge>
      </template>
    </b-table>
  </b-modal>
</template>
<script>
import {
  BModal,
  VBTooltip,
  BTable,
  BFormCheckbox,
  BButton,
  BCard,
  BRow,
  BCol,
  BAvatar,
  BBadge,
  VBModal,
  BFormGroup,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import userServices from '@/services/user'
import activityServices from '@/services/actitvity'

export default {
  components: {
    BModal,
    BTable,
    BFormCheckbox,
    BButton,
    BCard,
    BRow,
    BCol,
    BAvatar,
    BBadge,
    vSelect,
    BFormGroup,
  },
  directives: {
    'b-tooltip': VBTooltip,
    'b-modal': VBModal,
    Ripple,
  },
  props: {
    isVisible: {
      default: false,
      type: Boolean,
    },
    idEvent: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      selected: '',
      optionUser: [],
      fields: [
        { key: 'show_details', label: 'Hiển thị chi tiết' },
        { key: 'avatar', label: 'Avatar' },
        { key: 'fullname', label: 'Họ tên' },
        { key: 'quota', label: 'Định mức' },
        { key: 'status', label: 'Trạng thái' },
      ],
      items: [],
      status: [
        {
          accept: 'Chấp nhận',
          refuse: 'Từ chối',
          attended: 'Tham gia',
          notAnswered: 'Chưa trả lời',
          notEngaged: 'Chưa tham gia',
        },
        {
          accept: 'light-primary',
          refuse: 'light-success',
          attended: 'light-danger',
          notAnswered: 'light-warning',
          notEngaged: 'light-info',
        },
      ],
    }
  },
  created() {
    this.getAllUser()
    this.getListActivityDetailByID()
  },
  methods: {
    onClose() {
      this.$emit('close-modal-add')
    },
    async getAllUser() {
      try {
        const res = await userServices.getUsers()
        this.optionUser = res.data.data
      } catch (error) {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Notification',
            icon: 'BellIcon',
            text: error.response,
            variant: 'warning',
          },
        })
      }
    },
    async getListActivityDetailByID() {
      try {
        const res = await activityServices.getListActivityDetailByID(
          this.idEvent,
        )
        this.items = res.data.data.activityDetails
      } catch (error) {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Notification',
            icon: 'BellIcon',
            text: error.response,
            variant: 'warning',
          },
        })
      }
    },
    async handleAddAssignee() {
      try {
        await activityServices.addAssignee({
          activity: this.idEvent,
          assignee: this.selected,
        })
        this.getListActivityDetailByID()
      } catch (error) {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Notification',
            icon: 'BellIcon',
            text: error.response.data.message,
            variant: 'warning',
          },
        })
      }
    },
  },
}
</script>
