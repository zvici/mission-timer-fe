import axiosIns from '@/libs/axios'

const baseUrl = '/statistical'

const statisticalServices = {
  activityUsersStatistics: (semester) =>
    axiosIns.get(`${baseUrl}?semester=${semester}`),
  export: (user, year) =>
    axiosIns.get(`${baseUrl}/export`, { params: { user, year } }),
}
export default statisticalServices
