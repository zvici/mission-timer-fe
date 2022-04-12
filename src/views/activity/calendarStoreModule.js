/* eslint-disable no-unused-vars */
import axios from '@axios'

export default {
  namespaced: true,
  state: {
    calendarOptions: [
      {
        color: 'primary',
        label: 'Tự điểm danh',
      },
      {
        color: 'success',
        label: 'Giáo vụ điểm danh',
      },
      {
        color: 'danger',
        label: 'Canh thi',
      },
    ],
    selectedCalendars: ['STAFF', 'ACADEMIC_STAFF', 'MONITOR_EXAM'],
  },
  getters: {},
  mutations: {
    SET_SELECTED_EVENTS(state, val) {
      state.selectedCalendars = val
    },
  },
  actions: {
    fetchEvents(ctx, { calendars }) {
      return new Promise((resolve, reject) => {
        axios
          .get('/activity')
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    addEvent(ctx, { event }) {
      return new Promise((resolve, reject) => {
        axios
          .post('/activity', { event })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    updateEvent(ctx, { event }) {
      return new Promise((resolve, reject) => {
        axios
          .put(`/activity/${event.id}`, { event })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    removeEvent(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`/activity/${id}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
