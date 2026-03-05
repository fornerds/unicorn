import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

export const useProfile = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await apiFetch<{ data: { email: string; name: string; phone: string; marketingAgreed: boolean } }>('/users/me');
      return res.data;
    },
    enabled: isAuthenticated,
  });
};
