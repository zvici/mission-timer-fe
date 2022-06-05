import Vue from 'vue'
import { ToastPlugin, ModalPlugin } from 'bootstrap-vue'
import VueCompositionAPI from '@vue/composition-api'
import VueSweetalert2 from 'vue-sweetalert2'
import VueViewer from 'v-viewer'

import router from './router'
import store from './store'
import App from './App.vue'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'viewerjs/dist/viewer.css'

import '@core/scss/vue/libs/vue-select.scss'

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

//
Vue.use(VueViewer, {
  defaultOptions: {
    toolbar: false,
    navbar: false,
    title: false,
  },
})

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
  render: (h) => h(App),
}).$mount('#app')
