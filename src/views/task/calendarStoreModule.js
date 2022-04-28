/* eslint-disable no-unused-vars */
import axios from '@axios'

export default {
  namespaced: true,
  state: {
    calendarOptions: [
      {
        id: 'STAFF',
        color: 'success',
        label: 'Tự điểm danh',
      },
      {
        id: 'MINISTRY',
        color: 'warning',
        label: 'Giáo vụ điểm danh',
      },
      {
        id: 'MONITOR_EXAM',
        color: 'info',
        label: 'Canh thi',
      },
    ],
    selectedCalendars: ['STAFF', 'MINISTRY', 'MONITOR_EXAM'],
  },
  getters: {},
  mutations: {
    SET_SELECTED_EVENTS(state, val) {
      state.selectedCalendars = val
    },
  },
  actions: {
    fetchEvents(_ctx, { calendars, event }) {
      return new Promise((resolve, reject) => {
        axios
          .get('/task')
          .then((response) => resolve(response))
          .catch((error) => reject(error))
      })
    },
    addEvent(_ctx, { event }) {
      const body = {
        year: event.extendedProps.year,
        content: event.title,
        description: event.extendedProps.description,
        startDate: event.start,
        endDate: event.end,
      }
      return new Promise((resolve, reject) => {
        axios
          .post('/activity', body)
          .then((response) => resolve(response))
          .catch((error) => reject(error))
      })
    },
    updateEvent(_ctx, { event }) {
      const body = {
        year: event.extendedProps.year,
        content: event.title,
        description: event.extendedProps.description,
        startDate: event.start,
        endDate: event.end,
      }
      return new Promise((resolve, reject) => {
        axios
          .put(`/activity/${event.id}`, body)
          .then((response) => resolve(response))
          .catch((error) => reject(error))
      })
    },
    removeEvent(_ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`/activity/${id}`)
          .then((response) => resolve(response))
          .catch((error) => reject(error))
      })
    },
  },
}
