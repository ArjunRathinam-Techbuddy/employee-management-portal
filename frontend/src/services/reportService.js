import { apiClient } from './apiClient';

export const reportService = {
  headcount: () => apiClient.get('/reports/headcount').then((res) => res.data),
  salaryStats: () => apiClient.get('/reports/salary-stats').then((res) => res.data),
  leaveSummary: () => apiClient.get('/reports/leave-summary').then((res) => res.data),
  upcomingLeaves: (days) => apiClient.get('/reports/upcoming-leaves', { params: { days } }).then((res) => res.data),
};
