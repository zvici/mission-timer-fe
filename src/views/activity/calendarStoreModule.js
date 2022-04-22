/* eslint-disable no-unused-vars */
import axios from '@axios'

export default {
  namespaced: true,
  state: {
    calendarOptions: [
      {
        id: 'STAFF',
        color: 'success',
        label: 'Chấp nhận',
      },
      {
        id: 'ACADEMIC_STAFF',
        color: 'danger',
        label: 'Từ chối',
      },
      {
        id: 'MONITOR_EXAM',
        color: 'info',
        label: 'Đã tham gia',
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
    fetchEvents(_ctx, { calendars }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/activity/${calendars || '[]'}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    addEvent(_ctx, { event }) {
      const body = {
        year: event.extendedProps.year,
        content: event.title,
        description: event.extendedProps.description,
        startDate: event.start,
        endDate: event.end,
        rollUpType: event.extendedProps.calendar,
      }
      return new Promise((resolve, reject) => {
        axios
          .post('/activity', body)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    updateEvent(_ctx, { event }) {
      const body = {
        year: event.extendedProps.year,
        content: event.title,
        description: event.extendedProps.description,
        startDate: event.start,
        endDate: event.end,
        rollUpType: event.extendedProps.calendar,
      }
      return new Promise((resolve, reject) => {
        axios
          .put(`/activity/${event.id}`, body)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    removeEvent(_ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`/activity/${id}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
