import Vue from 'vue'
import moment from 'moment'

Vue.filter('filterDateTime', (date) =>
  date ? moment(date).format('HH:mm - DD/MM/YYYY') : ''
)
Vue.filter('filterDate', (date) =>
  date ? moment(date).format('DD/MM/YYYY') : ''
)
