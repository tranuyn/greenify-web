import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// ---- Constants ----
// Gợi ý: Trên web nên dùng process.env.NEXT_PUBLIC_API_URL, nhưng mình tạm giữ hardcode của bạn
const BASE_URL = 'http://192.168.1.3:8080/api/v1'; 
const ACCESS_TOKEN_KEY = 'auth.access_token';
const REFRESH_TOKEN_KEY = 'auth.refresh_token';

// ---- Token helpers (Phiên bản WEB) ----
export const tokenStorage = {
  getAccess: () => {
    if (typeof window !== 'undefined') return localStorage.getItem(ACCESS_TOKEN_KEY);
    return null;
  },
  getRefresh: () => {
    if (typeof window !== 'undefined') return localStorage.getItem(REFRESH_TOKEN_KEY);
    return null;
  },
  setAccess: (token: string) => {
    if (typeof window !== 'undefined') localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },
  setRefresh: (token: string) => {
    if (typeof window !== 'undefined') localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },
  clear: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  },
};

// ---- Axios instance ----
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 100_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ---- Request interceptor: attach Bearer token ----
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // localStorage là synchronous (chạy đồng bộ), không cần await nữa nhưng giữ cũng không sao
    const token = tokenStorage.getAccess();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---- Response interceptor: handle 401 → refresh ----
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

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes('/auth/refresh')
    ) {
      return Promise.reject(error);
    }

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

      const { data } = await axios.post(`${BASE_URL}/auth/refresh-token`, {
        refresh_token: refreshToken,
      });

      const newAccessToken: string = data.data.access_token;
      tokenStorage.setAccess(newAccessToken);

      processQueue(null, newAccessToken);
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      tokenStorage.clear();
      // Chỗ này thường sẽ gọi window.location.href = '/login' để đá user ra ngoài
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);