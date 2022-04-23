import axiosIns from '@/libs/axios'

const baseUrl = '/activity'

const activityServices = {
  getActivities: ({ content }) => axiosIns.get(`${baseUrl}?content=${content}`),
  createActivities: ({
    title, description, quota, content, type,
  }) => axiosIns.post(`${baseUrl}`, {
    title,
    description,
    quota,
    content,
    type,
  }),
  updateActivities: ({
    id, title, description, quota, content, type,
  }) => axiosIns.put(`${baseUrl}/${id}`, {
    id,
    title,
    description,
    quota,
    content,
    type,
  }),
}
export default activityServices
