import axiosIns from '@/libs/axios'

const baseUrl = '/user'

const userServices = {
  getUsers: ({ role }) =>
    axiosIns.get(`${baseUrl}?${role ? `role=${role}` : ''}`),
  addUser: (user) => axiosIns.post(`${baseUrl}`, user),
  // eslint-disable-next-line no-underscore-dangle
  updateUser: (user) => axiosIns.put(`${baseUrl}/${user._id}`, user),
  blockUser: (id) => axiosIns.put(`${baseUrl}/block/${id}`),
}
export default userServices
