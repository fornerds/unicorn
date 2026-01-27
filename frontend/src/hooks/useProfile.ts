import { useQuery } from '@tanstack/react-query';
import { getToken, getUserIdFromToken } from '@/utils/auth';
import { fetchUserProfile } from '@/lib/database';

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const token = getToken();
      if (!token) throw new Error('Not authenticated');
      
      const userId = getUserIdFromToken(token);
      if (!userId) throw new Error('Invalid token');
      
      return await fetchUserProfile(userId);
    },
    enabled: !!getToken(),
  });
};
