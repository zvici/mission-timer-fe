import axiosIns from '@/libs/axios'

const baseUrl = '/user'

const userServices = {
  getUsers: ({ role }) =>
    axiosIns.get(`${baseUrl}?${role ? `role=${role}` : ''}`),
  addUser: (user) => axiosIns.post(`${baseUrl}`, user),
}
export default userServices
