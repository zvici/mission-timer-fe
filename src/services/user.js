import axiosIns from '@/libs/axios'

const userServices = {
  getUsers: () => axiosIns.get('/user'),
  addUser: user => axiosIns.post('/user', user),
}
export default userServices
