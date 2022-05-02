import axiosIns from '@/libs/axios'

const baseUrl = '/statistical'

const statisticalServices = {
  activityUsersStatistics: () => axiosIns.get(`${baseUrl}?semester=62676c45f909867f8718d971`),
}
export default statisticalServices
