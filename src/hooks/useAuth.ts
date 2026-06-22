import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { configureClient } from '@/services/client';
import {
  fetchQrcode,
  pollStatus,
  refreshToken as refreshTokenApi,
  logout as logoutApi,
} from '@/services/auth';
import type { QrcodeResponse, StatusResponse } from '@/types';
import { POLL_INTERVAL } from '@/config/constants';

export function useAuth() {
  const navigate = useNavigate();
  const { jwt, refreshToken, user, isAuthenticated, login, logout } = useAuthStore();

  useEffect(() => {
    configureClient({
      getToken: () => useAuthStore.getState().jwt,
      onUnauthorized: () => {
        sessionStorage.setItem('preLoginPath', window.location.pathname);
        useAuthStore.getState().logout();
        navigate('/login');
      },
    });
  }, [navigate]);

  const handleLogin = useCallback(async (): Promise<QrcodeResponse> => {
    return fetchQrcode();
  }, []);

  const handlePollStatus = useCallback(
    async (tempToken: string, onStatus: (status: StatusResponse) => void) => {
      const poll = async () => {
        const result = await pollStatus(tempToken);
        onStatus(result);

        if (result.status === 'confirmed' && result.access_token && result.user) {
          login(result.access_token, result.refresh_token!, result.user);
          const preLoginPath = sessionStorage.getItem('preLoginPath');
          sessionStorage.removeItem('preLoginPath');
          navigate(preLoginPath || '/');
          return;
        }

        if (result.status !== 'confirmed') {
          setTimeout(poll, POLL_INTERVAL);
        }
      };

      await poll();
    },
    [login, navigate],
  );

  const handleRefresh = useCallback(async () => {
    if (!refreshToken) return;
    try {
      const result = await refreshTokenApi(refreshToken);
      useAuthStore.setState({ jwt: result.access_token });
    } catch {
      logout();
      navigate('/login');
    }
  }, [refreshToken, logout, navigate]);

  const handleLogout = useCallback(async () => {
    try {
      await logoutApi();
    } finally {
      logout();
      navigate('/login');
    }
  }, [logout, navigate]);

  return { user, jwt, refreshToken, isAuthenticated, login: handleLogin, pollStatus: handlePollStatus, refresh: handleRefresh, logout: handleLogout };
}
