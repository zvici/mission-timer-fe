import axiosIns from '@/libs/axios'

const baseUrl = '/department'

const departmentServices = {
  getDepartments: () => axiosIns.get(`${baseUrl}`),
  create: (department) => axiosIns.post(`${baseUrl}`, department),
  update: (department) => axiosIns.put(`${baseUrl}/${department.id}`, department),
  delete: (id) => axiosIns.delete(`${baseUrl}/${id}`),
}
export default departmentServices
