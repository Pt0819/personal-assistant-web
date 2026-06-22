import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  jwt: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (jwt: string, refreshToken: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      jwt: null,
      refreshToken: null,
      isAuthenticated: false,

      login: (jwt: string, refreshToken: string, user: User) =>
        set({ jwt, refreshToken, user, isAuthenticated: true }),

      logout: () =>
        set({ jwt: null, refreshToken: null, user: null, isAuthenticated: false }),

      setUser: (user: User) => set({ user }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        jwt: state.jwt,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
