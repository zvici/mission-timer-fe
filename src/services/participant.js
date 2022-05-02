import axiosIns from '@/libs/axios'

const baseUrl = '/participant'

const participantServices = {
  getParticipants: ({ task }) => axiosIns.get(`${baseUrl}?${task ? `task=${task}` : ''}`),
  createParticipant: ({ task, user }) => axiosIns.post(`${baseUrl}`, { task, user }),
  updateApprove: ({ id }) => axiosIns.put(`${baseUrl}/approve/${id}`),
  deleteAParticipant: ({ id }) => axiosIns.delete(`${baseUrl}/${id}`),
}
export default participantServices
