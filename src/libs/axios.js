import Vue from 'vue'
// eslint-disable-next-line import/no-cycle
import store from '@/store'
// axios
import axios from 'axios'

const axiosIns = axios.create({
  baseURL: 'https://mission-timer-be.herokuapp.com/api',
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
  },
})

axiosIns.interceptors.request.use(config => {
  const { token } = store.getters
  if (token) {
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

Vue.prototype.$http = axiosIns

export default axiosIns
