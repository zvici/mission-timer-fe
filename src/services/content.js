import axiosIns from '@/libs/axios'

const baseUrl = '/content'

const contentServices = {
  addContent: ({ title, description }) => axiosIns.post(`${baseUrl}`, { title, description }),
  getContens: () => axiosIns.get(`${baseUrl}`),
  updateContent: ({ id, title, description }) => axiosIns.put(`${baseUrl}/${id}`, { title, description }),
  deleteContent: id => axiosIns.delete(`${baseUrl}/${id}`),
}
export default contentServices
