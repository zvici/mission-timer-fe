import axiosIns from '@/libs/axios'
import axios from 'axios'

const baseUrl = '/semester'

const semesterServices = {
  getAll: () => axiosIns.get(`${baseUrl}`),

  create: (payload) => axiosIns.post(`${baseUrl}`, payload),

  update: (payload) => axiosIns.put(`${baseUrl}`, payload),

  delete: (id) => axios.delete(`${baseUrl}/${id}`),
}

export default semesterServices
