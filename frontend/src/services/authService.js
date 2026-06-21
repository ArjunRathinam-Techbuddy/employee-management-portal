import { apiClient } from './apiClient';

export const authService = {
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }).then((res) => res.data),

  logout: (refreshToken) =>
    apiClient.post('/auth/logout', { refreshToken }),
};
