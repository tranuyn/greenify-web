import { QueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ĐÃ SỬA: Trên web CÓ window focus, và nó rất hữu ích để tự auto-refresh data khi user quay lại tab
      refetchOnWindowFocus: true,

      // Stale sau 2 phút
      staleTime: 2 * 60 * 1000,
      // Giữ cache 5 phút
      gcTime: 5 * 60 * 1000,

      // Retry thông minh
      retry: (failureCount, error) => {
        if (error instanceof AxiosError) {
          const status = error.response?.status ?? 0;
          if (status >= 400 && status < 500) return false;
        }
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
