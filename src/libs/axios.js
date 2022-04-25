import Vue from 'vue'
// axios
import axios from 'axios'
import Cookies from 'js-cookie'

const axiosIns = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
  },
})

axiosIns.interceptors.request.use(config => {
  const token = Cookies.get('token')
  if (token) {
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

Vue.prototype.$http = axiosIns

export default axiosIns
