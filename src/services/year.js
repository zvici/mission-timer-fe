import axiosIns from '@/libs/axios'

const yearServices = {
  getYears: () => axiosIns.get('/year'),
  create: (year) => axiosIns.post('/year', year),
  delete: (id) => axiosIns.delete(`/year/${id}`),
}
export default yearServices
