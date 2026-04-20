import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// ---- Constants ----
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://greenify.io.vn/api/v1';
const ACCESS_TOKEN_KEY = 'auth.access_token';
const REFRESH_TOKEN_KEY = 'auth.refresh_token';

// ---- Token helpers (synchronous — localStorage is sync on the main thread) ----
export const tokenStorage = {
  getAccess: (): string | null => {
    if (typeof window !== 'undefined') return localStorage.getItem(ACCESS_TOKEN_KEY);
    return null;
  },
  getRefresh: (): string | null => {
    if (typeof window !== 'undefined') return localStorage.getItem(REFRESH_TOKEN_KEY);
    return null;
  },
  setAccess: (token: string): void => {
    if (typeof window !== 'undefined') localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },
  setRefresh: (token: string): void => {
    if (typeof window !== 'undefined') localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },
  clear: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  },
};

// ---- Axios instance (authenticated) ----
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 100_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ---- Axios instance (public — không cần token) ----
export const publicApiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 100_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ---- Request interceptor: gắn Bearer token vào mọi request authenticated ----
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getAccess();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---- Response interceptor: handle 401 → tự động refresh token ----
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

/**
 * Đá user về trang login khi refresh token thất bại.
 * Dùng window.location thay vì router để thoát khỏi React tree một cách sạch.
 */
const redirectToLogin = () => {
  if (typeof window !== 'undefined') {
    window.location.href = '/admin/login';
  }
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Không phải 401, hoặc đây là request retry, hoặc chính là request refresh
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes('/auth/refresh-token')
    ) {
      return Promise.reject(error);
    }

    // Nếu đang refresh, enqueue request hiện tại để retry sau
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = tokenStorage.getRefresh();
      if (!refreshToken) throw new Error('No refresh token');

      // Dùng camelCase "refreshToken" để thống nhất với BE Spring Boot (Jackson default)
      const { data } = await axios.post(`${BASE_URL}/auth/refresh-token`, {
        refreshToken,
      });

      const newAccessToken: string = data.access_token;
      tokenStorage.setAccess(newAccessToken);

      processQueue(null, newAccessToken);
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      tokenStorage.clear();
      redirectToLogin();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);