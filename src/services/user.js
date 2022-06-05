import axiosIns from '@/libs/axios'

const baseUrl = '/user'

const userServices = {
  getUsers: ({ role }) => axiosIns.get(`${baseUrl}?${role ? `role=${role}` : ''}`),
  addUser: user => axiosIns.post(`${baseUrl}`, user),
  // eslint-disable-next-line no-underscore-dangle
  updateUser: user => axiosIns.put(`${baseUrl}/${user._id}`, {
    ...user,
    devices: ['a39aa94a-b10a-4908-ad2d-982417064e0c'],
  }),
  blockUser: id => axiosIns.put(`${baseUrl}/block/${id}`),
}
export default userServices
