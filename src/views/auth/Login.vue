<template>
  <div class="auth-wrapper auth-v1 px-2">
    <div class="auth-inner py-2">
      <!-- Login v1 -->
      <b-card class="mb-0 login-card">
        <b-link class="brand-logo">
          <!-- <vuexy-logo /> -->
          <h2 class="brand-text text-primary ml-1 text-center">
            <img
              src="../../assets/images/logo/logo-hufi-new-v6.png"
              alt="logo"
              width="120"
            >
            <p class="mt-1">
              QUẢN LÝ CÔNG TÁC KHÁC
            </p>
          </h2>
        </b-link>
        <!-- form -->
        <validation-observer ref="loginValidation">
          <b-form
            class="auth-login-form mt-2"
            @submit.prevent
          >
            <!-- email -->
            <b-form-group
              label="Mã đăng nhập"
              label-for="login-email"
            >
              <validation-provider
                #default="{ errors }"
                name="Mã đăng nhập"
                rules="required"
              >
                <b-form-input
                  id="login-email"
                  v-model="userEmail"
                  :state="errors.length > 0 ? false : null"
                  name="login-email"
                  autofocus
                />
                <small class="text-danger">{{
                  errors[0] && 'Vui lòng nhập mã đăng nhập'
                }}</small>
              </validation-provider>
            </b-form-group>

            <!-- password -->
            <b-form-group>
              <div class="d-flex justify-content-between">
                <label for="password">Mật khẩu</label>
                <!-- <b-link :to="{name:'auth-forgot-password-v1'}">
                  <small>Forgot Password?</small>
                </b-link> -->
              </div>
              <validation-provider
                #default="{ errors }"
                name="Password"
                rules="required"
              >
                <b-input-group
                  class="input-group-merge"
                  :class="errors.length > 0 ? 'is-invalid' : null"
                >
                  <b-form-input
                    id="password"
                    v-model="password"
                    :type="passwordFieldType"
                    class="form-control-merge"
                    :state="errors.length > 0 ? false : null"
                    name="login-password"
                    placeholder="············"
                  />

                  <b-input-group-append is-text>
                    <feather-icon
                      class="cursor-pointer"
                      :icon="passwordToggleIcon"
                      @click="togglePasswordVisibility"
                    />
                  </b-input-group-append>
                </b-input-group>
                <small class="text-danger">{{
                  errors[0] && 'Vui lòng nhập mật khẩu'
                }}</small>
              </validation-provider>
            </b-form-group>

            <!-- checkbox -->
            <b-form-group>
              <!-- <b-form-checkbox
                id="remember-me"
                v-model="status"
                name="checkbox-1"
              >
                Remember Me
              </b-form-checkbox> -->
            </b-form-group>

            <!-- submit button -->
            <b-overlay
              :show="busy"
              rounded
              opacity="0.6"
              spinner-small
              spinner-variant="primary"
            >
              <b-button
                type="submit"
                variant="primary"
                block
                @click="validationForm"
              >
                Đăng nhập
              </b-button>
            </b-overlay>
          </b-form>
        </validation-observer>
        <div class="text-center mt-1">
          hoặc tải xuống với
        </div>
        <div class="qr-area">
          <img
            class="shadow-sm mt-1"
            height="40"
            src="../../assets/images/bg/google-play-icon-download.png"
          ></img>
          <img
            class="shadow-sm mt-1"
            height="40"
            src="../../assets/images/bg/app-store-icon-download.png"
          ></img>
        </div>
      </b-card>
      <!-- /Login v1 -->
    </div>
  </div>
</template>

<script>
/* eslint-disable global-require */
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import {
  BLink,
  BFormGroup,
  BFormInput,
  BInputGroupAppend,
  BInputGroup,
  BForm,
  BButton,
  BOverlay,
  BCard,
} from 'bootstrap-vue'
import { required } from '@validations'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import store from '@/store/index'

export default {
  components: {
    BLink,
    BFormGroup,
    BFormInput,
    BInputGroupAppend,
    BInputGroup,
    BForm,
    BCard,
    BButton,
    ValidationProvider,
    ValidationObserver,
    BOverlay,
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      busy: false,
      status: '',
      password: '',
      userEmail: '',
      sideImg: require('@/assets/images/pages/login-v2.svg'),
      // validation rulesimport store from '@/store/index'
      required,
    }
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
    imgUrl() {
      if (store.state.appConfig.layout.skin === 'dark') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.sideImg = require('@/assets/images/pages/login-v2-dark.svg')
        return this.sideImg
      }
      return this.sideImg
    },
  },
  methods: {
    validationForm() {
      this.$refs.loginValidation.validate().then(success => {
        if (success) {
          this.busy = true
          this.$store
            .dispatch('onLogin', {
              userId: this.userEmail,
              password: this.password,
            })
            .then(res => {
              this.$router.push('/')
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: `Chào ${res.data.user.name}`,
                  icon: 'BellIcon',
                  variant: 'success',
                },
              })
            })
            .catch(error => {
              this.busy = false
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: error.data?.message,
                  icon: 'BellIcon',
                  variant: 'warning',
                },
              })
            })
        }
      })
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';
.qr-area {
  display: flex;
  justify-content: space-around;
  img:hover{
    cursor: pointer;
  }
}
</style>
