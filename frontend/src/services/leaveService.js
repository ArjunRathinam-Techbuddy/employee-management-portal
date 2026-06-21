import { apiClient } from './apiClient';

export const leaveService = {
  myLeaves: (params) => apiClient.get('/leaves/my', { params }).then((res) => res.data),

  create: (payload) => apiClient.post('/leaves', payload).then((res) => res.data),

  cancel: (id) => apiClient.post(`/leaves/${id}/cancel`).then((res) => res.data),

  // Admin-side, used by the approval queue (next task)
  listAll: (params) => apiClient.get('/leaves', { params }).then((res) => res.data),
  approve: (id) => apiClient.post(`/leaves/${id}/approve`).then((res) => res.data),
  reject: (id, payload) => apiClient.post(`/leaves/${id}/reject`, payload).then((res) => res.data),
};
