import { apiClient } from "@/lib/apiClient";
import type {
  Co2WalletSummary,
  PostCo2e,
  Co2eHistoryItem,
  Co2eHistoryQueryParams,
} from "@/types/co2.types";
import { PageResponse } from "@/types/common.types";

// ============================================================
// CO2 SERVICE
// ============================================================
export const co2Service = {
  /**
   * Lấy tổng CO2e từ ví của user hiện tại
   * GET /api/v1/wallet/co2e
   */
  async getWalletCo2Summary(): Promise<Co2WalletSummary> {
    const { data } = await apiClient.get<Co2WalletSummary>("/wallet/co2e");
    return data;
  },

  /**
   * Lấy chi tiết CO2e của một bài đăng
   * GET /api/v1/posts/{postId}/co2e
   */
  async getPostCo2e(postId: string): Promise<PostCo2e> {
    const { data } = await apiClient.get<PostCo2e>(`/posts/${postId}/co2e`);
    return data;
  },

  /**
   * Lấy lịch sử CO2e của user hiện tại (có phân trang)
   * GET /api/v1/me/co2e-history
   */
  async getMyCo2eHistory(
    params?: Co2eHistoryQueryParams,
  ): Promise<PageResponse<Co2eHistoryItem>> {
    const { data } = await apiClient.get<PageResponse<Co2eHistoryItem>>(
      "/me/co2e-history",
      {
        params: {
          page: params?.page ? params.page - 1 : 0, // UI: 1-indexed → BE: 0-indexed
          size: params?.size ?? 10,
        },
      },
    );
    return data;
  },
};
