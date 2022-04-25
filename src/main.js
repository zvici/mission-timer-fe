import Vue from 'vue'
import OneSignalVue from 'onesignal-vue'
import { ToastPlugin, ModalPlugin } from 'bootstrap-vue'
import VueCompositionAPI from '@vue/composition-api'
import VueSweetalert2 from 'vue-sweetalert2'

import router from './router'
import store from './store'
import App from './App.vue'

// Global Components
import './global-components'

// 3rd party plugins
import '@/libs/portal-vue'
import '@/libs/toastification'

// filter global
import '@/libs/filter'

// BSV Plugin Registration
Vue.use(ToastPlugin)
Vue.use(ModalPlugin)
// SweetAlert
Vue.use(VueSweetalert2)

//OneSignalVue
Vue.use(OneSignalVue)

// Composition API
Vue.use(VueCompositionAPI)

// import core styles
require('@core/scss/core.scss')

// import assets styles
require('@/assets/scss/style.scss')

Vue.config.productionTip = false

new Vue({
  router,
  store,
  beforeMount() {
    this.$OneSignal
      .init({
        appId: 'b7c75e5d-4ed5-4e51-bc13-f38ff763cacb',
        allowLocalhostAsSecureOrigin: true,
      })
  },
  render: (h) => h(App),
}).$mount('#app')
