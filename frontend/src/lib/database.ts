import { User } from './types';

export const fetchUserProfile = async (userId: string): Promise<User> => {
  // TODO: 실제 데이터베이스 클라이언트 연결
  throw new Error('Not implemented');
};

export const updateUserProfile = async (
  userId: string,
  data: Partial<User>
): Promise<User> => {
  // TODO: 실제 데이터베이스 업데이트 로직 구현
  throw new Error('Not implemented');
};
