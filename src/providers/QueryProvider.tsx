"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "lib/queryClient";

/**
 * Dùng singleton queryClient từ lib/queryClient.ts để đảm bảo
 * tất cả mutations (useLogin, useLogout...) invalidate đúng cache
 * mà các query hooks (useCurrentUser) đang subscribe.
 *
 * KHÔNG tạo new QueryClient() ở đây — sẽ gây ra bug:
 * mutation invalidate Singleton A, component đọc từ Singleton B → không sync.
 */
export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
