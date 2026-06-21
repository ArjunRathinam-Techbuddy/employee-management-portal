import { apiClient } from './apiClient';

export const departmentService = {
  list: () => apiClient.get('/departments').then((res) => res.data),

  getById: (id) => apiClient.get(`/departments/${id}`).then((res) => res.data),

  create: (payload) => apiClient.post('/departments', payload).then((res) => res.data),

  update: (id, payload) => apiClient.put(`/departments/${id}`, payload).then((res) => res.data),

  remove: (id) => apiClient.delete(`/departments/${id}`),
};
