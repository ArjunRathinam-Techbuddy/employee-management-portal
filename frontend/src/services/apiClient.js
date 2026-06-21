import axios from 'axios';
import { tokenStorage } from '../utils/tokenStorage';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

let accessToken = null;
let onAuthFailure = () => {};

export const authTokenStore = {
  set: (token) => { accessToken = token; },
  get: () => accessToken,
  clear: () => { accessToken = null; },
  setOnAuthFailure: (handler) => { onAuthFailure = handler; },
};

export const apiClient = axios.create({
  baseURL: `${BASE_URL}/api`,
});

apiClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let refreshPromise = null;

async function refreshAccessToken() {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token available');

  const response = await axios.post(`${BASE_URL}/api/auth/refresh`, { refreshToken });
  const { accessToken: newAccess, refreshToken: newRefresh } = response.data;

  accessToken = newAccess;
  tokenStorage.setRefreshToken(newRefresh);
  return newAccess;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/')) {
      originalRequest._retry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => { refreshPromise = null; });
        }
        const newToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        accessToken = null;
        tokenStorage.clearRefreshToken();
        onAuthFailure();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
