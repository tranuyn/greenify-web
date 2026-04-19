import { useQuery } from '@tanstack/react-query';
import { adminUserService } from '@/services/admin.service';
import { QUERY_KEYS } from '@/constants/queryKeys';

// Hook lấy danh sách
export const useGetUsers = () => {
  return useQuery({
    queryKey: QUERY_KEYS.users.all,
    queryFn: () => adminUserService.getUsers(),
  });
};

// Hook lấy chi tiết 1 user
export const useGetUserDetail = (userId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.users.detail(userId),
    queryFn: () => adminUserService.getUserById(userId),
    enabled: !!userId,
  });
};