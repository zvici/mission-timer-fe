import axiosIns from '@/libs/axios'

const activityServices = {
  // Add activity detail
  addAssignee: ({ activity, assignee }) => axiosIns.post('/activity-detail', { activity, assignee }),
  getListActivityDetailByID: id => axiosIns.get(`/activity-detail/list/${id}`),
}
export default activityServices
