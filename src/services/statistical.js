import axiosIns from '@/libs/axios'

const baseUrl = '/statistical'

const statisticalServices = {
  activityUsersStatistics: (year) =>
    axiosIns.get(`${baseUrl}?year=${year}`),
  export: (user, year) =>
    axiosIns.get(`${baseUrl}/export`, { params: { user, year } }),
}
export default statisticalServices
