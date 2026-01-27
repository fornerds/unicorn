import { useQuery } from '@tanstack/react-query';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      // TODO: 제품 목록 조회 API 구현
      throw new Error('Not implemented');
    },
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      // TODO: 제품 상세 조회 API 구현
      throw new Error('Not implemented');
    },
    enabled: !!id,
  });
};
