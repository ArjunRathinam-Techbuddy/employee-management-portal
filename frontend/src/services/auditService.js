import { apiClient } from './apiClient';

export const auditService = {
  list: (params) => apiClient.get('/audit-logs', { params }).then((res) => res.data),
};
