import { apiClient, publicApiClient, tokenStorage } from 'lib/apiClient';
import type {
  LoginRequest,
  LoginResponse,
  RegisterEmailRequest,
  VerifyOtpRequest,
  VerifyOtpResponse,
  SetPasswordRequest,
  LogoutRequest,
  CompleteProfileRequest,
  CreateNgoProfileRequest,
  UserProfile,
  AuthenticatedUser,
  UserRole,
  NgoProfile,
} from 'types/user.type';
import { ApiResponse } from 'types/common.types';

export const authService = {
  /**
   * Bước 1: Gửi email để nhận OTP
   * POST /auth/register/send-otp
   */
  async requestOtp(payload: RegisterEmailRequest): Promise<ApiResponse<{ message: string }>> {
    try {
      const { data } = await publicApiClient.post('/auth/register/send-otp', payload);
      return data;
    } catch (error: any) {
      console.error('Lỗi khi request OTP:', error, error.response?.data);
      throw error;
    }
  },

  /**
   * Bước 2: Xác minh OTP
   * POST /auth/register/verify-otp
   * Response: { verificationToken }
   */
  async verifyOtp(payload: VerifyOtpRequest): Promise<ApiResponse<VerifyOtpResponse>> {
    try {
      const { data } = await publicApiClient.post<ApiResponse<VerifyOtpResponse>>(
        '/auth/register/verify-otp',
        payload
      );
      return data;
    } catch (error: any) {
      console.error('Lỗi khi verify OTP:', error, error.response?.data);
      throw error;
    }
  },

  /**
   * Bước 3: Đặt mật khẩu (đăng ký)
   * POST /auth/register
   * Response: { access_token, refresh_token }
   */
  async setPassword(payload: SetPasswordRequest): Promise<LoginResponse> {
    const { data } = await publicApiClient.post<LoginResponse>('/auth/register', payload);
    if (!data.access_token || !data.refresh_token) {
      throw new Error('Missing tokens in /auth/register response');
    }

    tokenStorage.setAccess(data.access_token);
    tokenStorage.setRefresh(data.refresh_token);
    return data;
  },

  /**
   * Đăng nhập → nhận token
   * POST /auth/authenticate
   * Body: { identifier, password }
   * Response: { access_token, refresh_token }
   */
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const { data } = await publicApiClient.post<LoginResponse>('/auth/authenticate', payload);
    if (!data.access_token || !data.refresh_token) {
      throw new Error('Missing tokens in /auth/authenticate response');
    }

    tokenStorage.setAccess(data.access_token);
    tokenStorage.setRefresh(data.refresh_token);
    return data;
  },

  /**
   * Refresh token → nhận access token mới
   * POST /auth/refresh-token
   * Body: { refreshToken } — camelCase theo Jackson default của Spring Boot
   */
  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const { data } = await publicApiClient.post<LoginResponse>('/auth/refresh-token', {
      refreshToken,
    });
    if (!data.access_token || !data.refresh_token) {
      throw new Error('Missing tokens in /auth/refresh-token response');
    }

    tokenStorage.setAccess(data.access_token);
    tokenStorage.setRefresh(data.refresh_token);
    return data;
  },

  /**
   * Đăng xuất
   * POST /auth/logout
   * Headers: Authorization: Bearer {access_token}
   * Body: { refreshToken }
   */
  async logout(): Promise<void> {
    const refreshToken = tokenStorage.getRefresh();
    try {
      // Gửi refreshToken lên BE để invalidate session
      await apiClient.post('/auth/logout', { refreshToken });
    } catch {
      // Dù BE lỗi, vẫn xóa token cục bộ để đảm bảo user được đăng xuất
    } finally {
      tokenStorage.clear();
    }
  },

  /**
   * Hoàn thiện hồ sơ sau đăng ký
   * POST /profiles
   */
  async completeProfile(payload: CompleteProfileRequest): Promise<UserProfile> {
    const { data } = await apiClient.post<UserProfile>('/profiles', payload);
    return data;
  },

  /**
   * Cập nhật hồ sơ
   * PUT /profiles
   */
  async updateProfile(payload: CompleteProfileRequest): Promise<UserProfile> {
    const { data } = await apiClient.put<UserProfile>('/profiles', payload);
    return data;
  },

  /**
   * Tạo hồ sơ NGO
   * POST /ngo-profiles
   */
  async createNgoProfile(payload: CreateNgoProfileRequest): Promise<NgoProfile> {
    const { data } = await apiClient.post<NgoProfile>('/ngo-profiles', payload);
    return data;
  },

  /**
   * Lấy thông tin user hiện tại (dùng trong useCurrentUser hook)
   * GET /users/me
   * Headers: Authorization: Bearer {access_token}
   */
  async getMe(): Promise<AuthenticatedUser> {
    const { data } = await apiClient.get<AuthenticatedUser>('/users/me');
    return data;
  },
};

