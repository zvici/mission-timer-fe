import axiosIns from '@/libs/axios'

const departmentServices = {
  getDepartments: () => axiosIns.get('/department'),
}
export default departmentServices
