import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { co2Service } from "@/services/co2.service";
import type { Co2eHistoryQueryParams } from "@/types/co2.types";

/**
 * Lấy tổng CO2e summary từ ví (tránh phát thải + hấp thụ)
 */
export const useCo2WalletSummary = () => {
  return useQuery({
    queryKey: QUERY_KEYS.co2.walletSummary(),
    queryFn: () => co2Service.getWalletCo2Summary(),
  });
};

/**
 * Lấy chi tiết CO2e của một bài đăng cụ thể
 */
export const usePostCo2e = (postId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.co2.postDetail(postId),
    queryFn: () => co2Service.getPostCo2e(postId),
    enabled: !!postId,
  });
};

/**
 * Lấy lịch sử CO2e của user hiện tại, có phân trang
 */
export const useCo2eHistory = (params?: Co2eHistoryQueryParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.co2.history(params),
    queryFn: () => co2Service.getMyCo2eHistory(params),
  });
};
