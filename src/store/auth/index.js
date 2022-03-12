import axios from '@/libs/axios'
import Cookies from 'js-cookie'

export default {
  state: {
    isAuthenticated: !!Cookies.get('isAuthenticated'),
    token: Cookies.get('token') ? Cookies.get('token') : null,
  },
  getters: {
    token: (state) => state.token,
    isAuthenticated: (state) => state.isAuthenticated,
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
        axios
          .post('/auth/login', payload)
          .then((res) => {
            context.commit('setAuthenticated', {
              isAuthenticated: true,
              token: res.data,
            })
            resolve({ success: true, data: res.data })
          })
          .catch((error) => reject(error.message))
      })
    },
  },
}
