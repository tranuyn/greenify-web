import { apiClient } from "@/lib/apiClient";
import type {
  AnalyticsQueryParams,
  AdminDashboardResponse,
  NgoDashboardResponse,
} from "@/types/analytics.types";

export const analystService = {
  /**
   * Lấy dữ liệu thống kê cho Admin Dashboard
   * GET /api/v1/analyst/admin/dashboard
   */
  async getAdminDashboard(
    params?: AnalyticsQueryParams,
  ): Promise<AdminDashboardResponse> {
    const { data } = await apiClient.get<AdminDashboardResponse>(
      "/analyst/admin/dashboard",
      { params },
    );
    return data;
  },

  /**
   * Lấy dữ liệu thống kê cho NGO Dashboard
   * GET /api/v1/analyst/ngo/dashboard
   */
  async getNgoDashboard(
    params?: AnalyticsQueryParams,
  ): Promise<NgoDashboardResponse> {
    const { data } = await apiClient.get<NgoDashboardResponse>(
      "/analyst/ngo/dashboard",
      { params },
    );
    return data;
  },
};
