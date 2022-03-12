import axios from '@/libs/axios'

export default {
  state: {
    isAuthenticated: !!localStorage.getItem('isAuthenticated'),
    token: localStorage.getItem('token') ? localStorage.getItem('token') : null,
    userData: localStorage.getItem('userData')
      ? JSON.parse(localStorage.getItem('userData'))
      : null,
  },
  getters: {
    token: state => state.token,
    isAuthenticated: state => state.isAuthenticated,
    userData: state => state.userData,
  },
  mutations: {
    setAuthenticated(state, payload) {
      localStorage.setItem('isAuthenticated', payload.isAuthenticated)
      state.isAuthenticated = payload.isAuthenticated
      localStorage.setItem('token', payload.userData.token)
      state.token = payload.userData.token
      localStorage.setItem('userData', JSON.stringify(payload.userData))
      state.userData = payload.userData
    },
    removeAuthentication(state) {
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('token')
      localStorage.removeItem('userData')
      state.isAuthenticated = false
      state.token = null
      state.userData = null
    },
  },
  actions: {
    onLogin(context, payload) {
      return new Promise((resolve, reject) => {
        axios
          .post('/users/login', payload)
          .then(res => {
            context.commit('setAuthenticated', {
              isAuthenticated: true,
              userData: res.data,
            })
            resolve({ success: true, data: res.data })
          })
          .catch(error => reject(error.message))
      })
    },
  },
}
