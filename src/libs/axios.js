import Vue from 'vue'

// axios
import axios from 'axios'

const axiosIns = axios.create({
  baseURL: 'https://mission-timer-be.herokuapp.com/api',
})

Vue.prototype.$http = axiosIns

export default axiosIns
