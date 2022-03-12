import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import Cookies from 'js-cookie'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      meta: {
        isRedirectIfLoggedIn: true,
        pageTitle: 'home',
        breadcrumb: [
          {
            text: 'Home',
            active: true,
          },
        ],
      },
    },
    {
      path: '/second-page',
      name: 'second-page',
      component: () => import('@/views/SecondPage.vue'),
      meta: {
        isRedirectIfLoggedIn: true,
        pageTitle: 'Second Page',
        breadcrumb: [
          {
            text: 'Second Page',
            active: true,
          },
        ],
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/Login.vue'),
      meta: {
        isRedirectIfLoggedIn: false,
        layout: 'full',
      },
    },
    {
      path: '/error-404',
      name: 'error-404',
      component: () => import('@/views/error/Error404.vue'),
      meta: {
        layout: 'full',
      },
    },
    {
      path: '*',
      redirect: 'error-404',
    },
  ],
})

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})

// Check token khi chuyển route
router.beforeEach((to, _, next) => {
  const token = Cookies.get('token')
  if (to.meta.isRedirectIfLoggedIn) {
    if (!token) {
      store.commit('removeAuthentication')
      return next({ name: 'login' })
    }
  }
  if (to.meta.isRedirectIfLoggedIn === false) {
    if (token) {
      return next({ name: 'home' })
    }
  }
  return next()
})

export default router
