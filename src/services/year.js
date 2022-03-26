import axiosIns from '@/libs/axios'

const yearServices = {
  getYears: () => axiosIns.get('/year'),
  addYear: year => axiosIns.post('/year', year),
}
export default yearServices
