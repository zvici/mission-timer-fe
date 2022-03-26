// eslint-disable-next-line import/no-cycle
import Cookies from 'js-cookie'
// eslint-disable-next-line import/no-cycle
import axiosIns from '@/libs/axios'

export default {
  state: {
    isAuthenticated: !!Cookies.get('isAuthenticated'),
    token: Cookies.get('token') ? Cookies.get('token') : null,
  },
  getters: {
    token: state => state.token,
    isAuthenticated: state => state.isAuthenticated,
  },
  mutations: {
    setAuthenticated(state, payload) {
      Cookies.set('isAuthenticated', payload.isAuthenticated)
      state.isAuthenticated = payload.isAuthenticated
      Cookies.set('token', payload.token)
      state.token = payload.token
    },
    removeAuthentication(state) {
      Cookies.remove('isAuthenticated')
      Cookies.remove('token')
      state.isAuthenticated = false
      state.token = null
    },
  },
  actions: {
    onLogin(context, payload) {
      return new Promise((resolve, reject) => {
        axiosIns
          .post('/auth/login', payload)
          .then(res => {
            console.log(res)
            context.commit('setAuthenticated', {
              isAuthenticated: true,
              token: res.data.data.token,
            })
            resolve({ success: true, data: res.data.data.token })
          })
          .catch(error => {
            reject(error.response)
          })
      })
    },
  },
}
