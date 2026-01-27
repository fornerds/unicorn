import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserProfile } from '@/lib/database';
import { useAuthStore } from '@/stores/authStore';
import { User } from '@/lib/types';

export type UpdateProfileData = Partial<User>;

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const updateAuthState = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      // TODO: userId를 어떻게 가져올지 결정 필요
      throw new Error('Not implemented');
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ['profile'] });
      
      const previousProfile = queryClient.getQueryData(['profile']);
      
      queryClient.setQueryData(['profile'], (old: any) => ({
        ...old,
        ...newData,
      }));
      
      updateAuthState(newData);
      
      return { previousProfile };
    },
    onError: (err, newData, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(['profile'], context.previousProfile);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};
