import { useMutation } from '@tanstack/react-query';
import { useRouter } from '@/i18n/routing';
import { queryClient } from 'lib/queryClient';
import { authService } from 'services/auth.service';
import {
  CompleteProfileRequest,
  LoginRequest,
  RegisterEmailRequest,
  VerifyOtpRequest,
  SetPasswordRequest,
  CreateNgoProfileRequest,
} from 'types/user.type';
import { QUERY_KEYS } from 'constants/queryKeys';


/**
 * Gửi OTP về email.
 *
 * Cách dùng trong component:
 *   const { mutate: requestOtp, isPending } = useRequestOtp();
 *   requestOtp({ identifier: 'email@example.com' }, {
 *     onSuccess: () => router.push('/(auth)/verify-email'),
 *     onError: (err) => setError(parseApiError(err)),
 *   });
 *
 * Lý do onSuccess/onError để ở component thay vì hook:
 * - Navigation logic thuộc về UI layer
 * - Mỗi màn hình có thể handle error khác nhau (show toast, show inline error...)
 * - Hook chỉ lo phần gọi API
 */
export const useRequestOtp = () => {
  return useMutation({
    mutationFn: (payload: RegisterEmailRequest) => authService.requestOtp(payload),
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: (payload: VerifyOtpRequest) => authService.verifyOtp(payload),
  });
};

export const useSetPassword = () => {
  return useMutation({
    mutationFn: (payload: SetPasswordRequest) => authService.setPassword(payload),
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (payload: LoginRequest) => authService.login(payload),
    onSuccess: () => {
      // Token đã được lưu trong authService.login().
      // Invalidate query 'me' để useCurrentUser refetch ngay — layout nhận được
      // user data và không redirect về login nữa.
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.me() });
    },
  });
};

export const useCompleteProfile = () => {
  return useMutation({
    mutationFn: (payload: CompleteProfileRequest) => authService.completeProfile(payload),
    onSuccess: () => {
      // Profile đã thay đổi → invalidate cache /me để refetch
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.me() });
    },
  });
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: (payload: CompleteProfileRequest) => authService.updateProfile(payload),
    onSuccess: () => {
      // Profile đã thay đổi → invalidate cache /me để refetch
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.me() });
    },
  });
};

export const useCreateNgoProfile = () => {
  return useMutation({
    mutationFn: (payload: CreateNgoProfileRequest) => authService.createNgoProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.me() });
    },
  });
};
export const useLogout = (redirectUrl: string = '/login') => {
  const router = useRouter();
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Xóa toàn bộ cache khi logout — tránh data của user cũ còn sót
      queryClient.clear();
      router.replace(redirectUrl);
    },
  });
};
