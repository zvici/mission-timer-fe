import axiosIns from '@/libs/axios'

const baseUrl = '/subject'

const subjectServices = {
  getSubjects: department => axiosIns.get(`${baseUrl}?department=${department}`),
}
export default subjectServices
