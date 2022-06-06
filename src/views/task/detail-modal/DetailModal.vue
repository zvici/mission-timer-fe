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
            :reduce="(user) => user._id"
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
          @click="createParticipant()"
        >
          Thêm người thực hiện
        </b-button>
      </b-col>
    </b-row>
    <b-overlay :show="isBusy" rounded="sm">
      <b-table
        :items="items"
        :fields="fields"
        striped
        responsive
        bordered
        show-empty
      >
        <!-- A virtual column -->
        <template #cell(index)="data">
          {{ data.index + 1 }}
        </template>
        <template #cell(user)="data">
          {{ data.value.name }}
        </template>
        <template #cell(imageBase64)="data">
          <viewer>
            <img
              :src="data.value"
              width="70px"
              style="cursor: pointer; border-radius: 3px"
            />
          </viewer>
        </template>
        <template #cell(status)="data">
          <b-badge v-if="data.value === 'notAnswered'" variant="info">
            Chưa trả lời
          </b-badge>
          <b-badge v-if="data.value === 'accept'" variant="primary">
            Chấp nhận
          </b-badge>
          <b-badge v-if="data.value === 'refuse'" variant="danger">
            Từ chối
          </b-badge>
          <b-badge v-if="data.value === 'incomplete'" variant="dark">
            Không hoàn thành
          </b-badge>
          <b-badge v-if="data.value === 'done'" variant="success">
            Hoàn thành
          </b-badge>
        </template>
        <template #cell(isApprove)="data">
          <b-form-checkbox
            v-if="infoActivity.type === 'MINISTRY'"
            :checked="data.item.status === 'done'"
            class="custom-control-success"
            name="check-button"
            switch
            inline
            @change="handleChangeStatus(data.item)"
          />
        </template>
        <template #cell(action)="data">
          <div class="d-flex">
            <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="gradient-danger"
              class="btn-icon rounded-circle ml-1"
              @click="deleteParticipant(data.item._id)"
            >
              <feather-icon icon="Trash2Icon" />
            </b-button>
          </div>
        </template>
        <template #table-busy>
          <div class="text-center text-primary my-2">
            <b-spinner class="align-middle" />
          </div>
        </template>
      </b-table>
    </b-overlay>
  </b-modal>
</template>
<script>
import {
  BModal,
  VBTooltip,
  BTable,
  BButton,
  BRow,
  BCol,
  BAvatar,
  VBModal,
  BFormGroup,
  BBadge,
  BFormCheckbox,
  BSpinner,
  BOverlay,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import userServices from '@/services/user'
import participantServices from '@/services/participant'

export default {
  components: {
    BModal,
    BTable,
    BButton,
    BRow,
    BCol,
    BAvatar,
    vSelect,
    BFormGroup,
    BBadge,
    BFormCheckbox,
    BSpinner,
    BOverlay,
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
    infoActivity: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      selected: '',
      optionUser: [],
      fields: [
        { key: 'index', label: 'STT' },
        { key: 'user', label: 'Họ tên' },
        { key: 'status', label: 'Trạng thái' },
        { key: 'reason', label: 'Lý do' },
        { key: 'image', label: 'Minh chứng' },
        { key: 'isApprove', label: 'Xác nhận hoàn thành công việc' },
        { key: 'action', label: 'Hành động' },
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
      isBusy: true,
      empty: {
        text: 'Không có dữ liệu',
        status: 'text-primary',
      },
    }
  },
  watch: {
    isVisible() {
      if (this.isVisible === true) {
        this.getAllUser()
        this.getParticipantsByTask()
      }
    },
  },
  methods: {
    onClose() {
      this.$emit('close-modal-add')
    },
    async handleChangeStatus(data) {
      this.isBusy = true
      try {
        let status = 'done'
        if (data.status === 'done') {
          status = 'incomplete'
        }
        const res = await participantServices.updateApprove({
          id: data._id,
          status,
        })
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Thông báo',
            icon: 'BellIcon',
            text: res.data.message,
            variant: 'success',
          },
        })
        this.getParticipantsByTask()
      } catch (error) {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Thông báo',
            icon: 'BellIcon',
            text: error.response?.data.message
              ? error.response?.data.message
              : error.toString(),
            variant: 'warning',
          },
        })
      } finally {
        this.isBusy = false
      }
    },
    async getAllUser() {
      this.isBusy = true
      try {
        const res = await userServices.getUsers({ role: 'STAFF' })
        this.optionUser = res.data.data.users
      } catch (error) {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Thông báo',
            icon: 'BellIcon',
            text: error.response?.message
              ? error.response.message
              : error.toString(),
            variant: 'warning',
          },
        })
      }
      this.isBusy = false
    },
    async getParticipantsByTask() {
      this.isBusy = true
      try {
        const res = await participantServices.getParticipants({
          task: this.idEvent,
        })
        this.items = res.data.data.participants
      } catch (error) {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Thông báo',
            icon: 'BellIcon',
            text: error.response?.message
              ? error.response.message
              : error.toString(),
            variant: 'warning',
          },
        })
      } finally {
        this.isBusy = false
      }
    },
    async createParticipant() {
      this.isBusy = true
      try {
        const res = await participantServices.createParticipant({
          task: this.idEvent,
          user: this.selected,
        })
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Thông báo',
            icon: 'BellIcon',
            text: res.data.message,
            variant: 'success',
          },
        })
        this.getParticipantsByTask()
      } catch (error) {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Thông báo',
            icon: 'BellIcon',
            text: error.response?.data.message
              ? error.response?.data.message
              : error.toString(),
            variant: 'warning',
          },
        })
      } finally {
        this.isBusy = false
      }
    },
    async deleteParticipant(id) {
      this.$swal({
        title: 'Bạn chắc chứ?',
        text: 'Bạn sẽ không thể hoàn tác hành động này!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Vâng, tôi sẽ xoá nó!',
        cancelButtonText: 'Đóng',
        customClass: {
          confirmButton: 'btn btn-outline-danger',
          cancelButton: 'btn btn-primary ml-1',
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          participantServices
            .deleteAParticipant({ id })
            .then((res) => {
              this.$swal({
                icon: 'success',
                title: 'Đã xoá!',
                text: res.data.message,
                customClass: {
                  confirmButton: 'btn btn-success',
                },
              })
            })
            .catch((err) => {
              this.$swal({
                icon: 'error',
                title: 'Lỗi!',
                text: err.response.data.message,
                customClass: {
                  confirmButton: 'btn btn-success',
                },
              })
            })
            .finally(() => {
              this.getParticipantsByTask()
            })
        }
      })
    },
  },
}
</script>
