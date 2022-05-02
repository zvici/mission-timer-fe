/* eslint-disable no-unused-vars */
import axiosIns from '@/libs/axios'
import moment from 'moment'

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
        axiosIns
          .get('/task')
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    addEvent(_ctx, { event }) {
      const body = {
        activity: event.extendedProps.activity,
        description: event.title,
        startDate: moment(event.start, 'YYYY/MM/DD HH:mm').toString(),
        endDate: moment(event.end, 'YYYY/MM/DD HH:mm').toString(),
        officeHours: event.extendedProps.officeHours,
        listOfParticipants: event.extendedProps.participants,
        semester: event.extendedProps.semester,
      }
      return new Promise((resolve, reject) => {
        axiosIns
          .post('/task', body)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    updateEvent(_ctx, { event }) {
      const body = {
        activity: event.extendedProps.activity,
        description: event.title,
        startDate: moment(event.start, 'YYYY/MM/DD HH:mm').toString(),
        endDate: moment(event.end, 'YYYY/MM/DD HH:mm').toString(),
        officeHours: event.extendedProps.officeHours,
        semester: event.extendedProps.semester,
      }
      return new Promise((resolve, reject) => {
        axiosIns
          .put(`/task/${event.id}`, body)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    removeEvent(_ctx, { id }) {
      return new Promise((resolve, reject) => {
        axiosIns
          .delete(`/activity/${id}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
