import axiosIns from '@/libs/axios'

const baseUrl = '/subject'

const subjectServices = {
  getSubjects: (department) =>
    axiosIns.get(`${baseUrl}?department=${department}`),
  create: (subject) => axiosIns.post(`${baseUrl}`, subject),
  update: (subject) => axiosIns.put(`${baseUrl}/${subject.id}`, subject),
  delete: (id) => axiosIns.delete(`${baseUrl}/${id}`),
}
export default subjectServices
