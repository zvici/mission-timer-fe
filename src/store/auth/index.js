import Cookies from 'js-cookie'
import axiosIns from '@/libs/axios'

export default {
  state: {
    isAuthenticated: !!Cookies.get('isAuthenticated'),
    token: Cookies.get('token') ? Cookies.get('token') : null,
    userData: Cookies.get('userData') ? Cookies.get('userData') : null,
  },
  getters: {
    token: state => state.token,
    isAuthenticated: state => state.isAuthenticated,
    userData: state => state.userData,
  },
  mutations: {
    setAuthenticated(state, payload) {
      Cookies.set('isAuthenticated', payload.isAuthenticated)
      state.isAuthenticated = payload.isAuthenticated
      Cookies.set('token', payload.token)
      state.token = payload.token
      Cookies.set('userData', payload.userData)
      state.userData = payload.userData
    },
    removeAuthentication(state) {
      Cookies.remove('isAuthenticated')
      Cookies.remove('token')
      Cookies.remove('userData')
      state.isAuthenticated = false
      state.token = null
      state.userData = null
    },
  },
  actions: {
    onLogin(context, payload) {
      return new Promise((resolve, reject) => {
        axiosIns
          .post('/user/login', payload)
          .then(res => {
            console.log(res)
            context.commit('setAuthenticated', {
              isAuthenticated: true,
              token: res.data.data.token,
              userData: res.data.data.user,
            })
            resolve({ success: true, data: res.data.data })
          })
          .catch(error => {
            reject(error.response)
          })
      })
    },
  },
}
