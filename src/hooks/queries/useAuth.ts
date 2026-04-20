import { useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from 'constants/queryKeys';
import { authService } from 'services/auth.service';
import { tokenStorage } from 'lib/apiClient';
import { AuthenticatedUser } from 'types/user.type';

/**
 * Lấy thông tin user hiện tại.
 *
 * - Chỉ fetch khi có access token (enabled guard).
 *   Không có guard → query sẽ gọi /users/me liên tục khi chưa đăng nhập
 *   → BE trả 401 → layout redirect → lại gọi... → vòng lặp vô tận.
 * - Data sống được 10 phút. Trong 10 phút này nếu component mount,
 *   nó lấy thẳng từ cache (Sync 100%, không loading).
 */
export const useCurrentUser = () => {
  return useQuery({
    queryKey: QUERY_KEYS.auth.me(),
    queryFn: async () => {
      // Khi không có truy cập hợp lệ, ném lỗi ngay để query trở thành Error state.
      // Tránh việc dùng enabled: false làm query bị kẹt ở trạng thái Pending vô tận.
      if (!tokenStorage.getAccess()) {
        throw new Error('Unauthorized');
      }
      return authService.getMe();
    },
    staleTime: 10 * 60 * 1000,
    retry: false, // Tránh cố gắng gọi lại API nhiều lần khi 401
  });
};

export const useAuthRole = () => {
  const queryClient = useQueryClient();
  const authData = queryClient.getQueryData<AuthenticatedUser>(QUERY_KEYS.auth.me());
  const roles = authData?.roles ?? [];

  return {
    userId: authData?.id ?? null,
    role: roles,
    isNgo: roles.includes('NGO'),
    isCitizen: roles.includes('USER'),
    isCtv: roles.includes('CTV'),
    isAdmin: roles.includes('ADMIN'),
  };
};
