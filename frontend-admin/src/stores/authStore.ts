import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface AdminAuthState {
  accessToken: string | null;
  user: AdminUser | null;
  isAuthenticated: boolean;
  setAdminAuth: (accessToken: string, user: AdminUser) => void;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      setAdminAuth: (accessToken, user) =>
        set({ accessToken, user, isAuthenticated: true }),
      setAccessToken: (accessToken) => set({ accessToken }),
      logout: () =>
        set({ accessToken: null, user: null, isAuthenticated: false }),
    }),
    { name: 'unicorn-admin-auth' }
  )
);
