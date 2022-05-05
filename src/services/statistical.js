import axiosIns from '@/libs/axios'

const baseUrl = '/statistical'

const statisticalServices = {
  activityUsersStatistics: (semester) =>
    axiosIns.get(`${baseUrl}?semester=${semester}`),
}
export default statisticalServices
