import { apiClient } from './apiClient';

export const employeeService = {
  list: (params) => apiClient.get('/employees', { params }).then((res) => res.data),

  getById: (id) => apiClient.get(`/employees/${id}`).then((res) => res.data),

  create: (payload) => apiClient.post('/employees', payload).then((res) => res.data),

  update: (id, payload) => apiClient.put(`/employees/${id}`, payload).then((res) => res.data),

  softDelete: (id) => apiClient.delete(`/employees/${id}`),

  reactivate: (id) => apiClient.post(`/employees/${id}/reactivate`),
};
