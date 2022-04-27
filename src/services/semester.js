import axiosIns from '@/libs/axios'

const baseUrl = '/semester'

const semesterServices = {
  getAll: ({ year }) =>
    axiosIns.get(`${baseUrl}?${year ? `year=${year}` : ''}`),
  create: ({ name, year, startDate, endDate, description }) =>
    axiosIns.post(`${baseUrl}`, {
      name,
      year,
      startDate,
      endDate,
      description,
    }),
  update: ({ _id, name, year, startDate, endDate, description }) =>
    axiosIns.put(`${baseUrl}/${_id}`, {
      name,
      year,
      startDate,
      endDate,
      description,
    }),

  delete: (id) => axiosIns.delete(`${baseUrl}/${id}`),
}

export default semesterServices
