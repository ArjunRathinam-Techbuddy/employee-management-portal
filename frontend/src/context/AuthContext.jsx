import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';
import { apiClient, authTokenStore } from '../services/apiClient';
import { tokenStorage } from '../utils/tokenStorage';
import { decodeJwtPayload } from '../utils/jwt';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const applySession = useCallback((accessToken, refreshToken, email, role) => {
    authTokenStore.set(accessToken);
    tokenStorage.setRefreshToken(refreshToken);
    setUser({ email, role });
  }, []);

  const clearSession = useCallback(() => {
    authTokenStore.clear();
    tokenStorage.clearRefreshToken();
    setUser(null);
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authService.login(email, password);
    applySession(data.accessToken, data.refreshToken, data.email, data.role);
    return data;
  }, [applySession]);

  const logout = useCallback(async () => {
    const refreshToken = tokenStorage.getRefreshToken();
    clearSession();
    if (refreshToken) {
      try { await authService.logout(refreshToken); } catch { /* best-effort */ }
    }
  }, [clearSession]);

  useEffect(() => {
    authTokenStore.setOnAuthFailure(() => clearSession());

    async function restoreSession() {
      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken) {
        setIsLoading(false);
        return;
      }
      try {
        const { data } = await apiClient.post('/auth/refresh', { refreshToken });
        authTokenStore.set(data.accessToken);
        tokenStorage.setRefreshToken(data.refreshToken);
        const claims = decodeJwtPayload(data.accessToken);
        if (claims) {
          setUser({ email: claims.sub, role: claims.role });
        }
      } catch {
        clearSession();
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, [clearSession]);

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  }), [user, isLoading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
