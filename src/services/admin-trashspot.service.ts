import { apiClient } from "@/lib/apiClient";
import type { PageResponse } from "@/types/common.types";
import type {
  TrashSpotSummaryDto,
  TrashSpotDetailDto,
  ResolveRequestDto,
  AdminTrashReportDto,
  AdminTrashSpotsParams,
  AdminResolveRequestsParams,
  AdminTrashReportsParams,
  RejectResolveRequestBody,
} from "@/types/trashspot.types";

// ============================================================
// ADMIN TRASH-SPOT SERVICE
// Base prefix: /admin/trash-spots
// ============================================================
export const adminTrashSpotService = {
  /**
   * GET /api/v1/admin/trash-spots
   * Danh sách tất cả điểm rác (có filter status, province, severity, wasteType).
   */
  async getTrashSpots(
    params?: AdminTrashSpotsParams,
  ): Promise<PageResponse<TrashSpotSummaryDto>> {
    const { data } = await apiClient.get<PageResponse<TrashSpotSummaryDto>>(
      "/admin/trash-spots",
      { params: { ...params, page: params?.page ?? 0, size: params?.size ?? 20 } },
    );
    return data;
  },

  /**
   * GET /api/v1/admin/trash-spots/resolve-requests
   * Danh sách yêu cầu giải quyết của NGO, admin duyệt / từ chối.
   */
  async getResolveRequests(
    params?: AdminResolveRequestsParams,
  ): Promise<PageResponse<ResolveRequestDto>> {
    const { data } = await apiClient.get<PageResponse<ResolveRequestDto>>(
      "/admin/trash-spots/resolve-requests",
      { params: { ...params, page: params?.page ?? 0, size: params?.size ?? 20 } },
    );
    return data;
  },

  /**
   * GET /api/v1/admin/trash-spots/reports
   * Danh sách báo cáo điểm rác từ người dùng.
   */
  async getTrashReports(
    params?: AdminTrashReportsParams,
  ): Promise<PageResponse<AdminTrashReportDto>> {
    const { data } = await apiClient.get<PageResponse<AdminTrashReportDto>>(
      "/admin/trash-spots/reports",
      { params: { page: params?.page ?? 0, size: params?.size ?? 20 } },
    );
    return data;
  },

  /**
   * POST /api/v1/admin/trash-spots/resolve-requests/{id}/approve
   * Admin chấp thuận yêu cầu giải quyết điểm rác.
   */
  async approveResolveRequest(id: string): Promise<ResolveRequestDto> {
    const { data } = await apiClient.post<ResolveRequestDto>(
      `/admin/trash-spots/resolve-requests/${id}/approve`,
    );
    return data;
  },

  /**
   * POST /api/v1/admin/trash-spots/resolve-requests/{id}/reject
   * Admin từ chối yêu cầu giải quyết điểm rác.
   */
  async rejectResolveRequest(
    id: string,
    payload: RejectResolveRequestBody,
  ): Promise<ResolveRequestDto> {
    const { data } = await apiClient.post<ResolveRequestDto>(
      `/admin/trash-spots/resolve-requests/${id}/reject`,
      payload,
    );
    return data;
  },

  /**
   * PATCH /api/v1/admin/trash-spots/{id}/reopen
   * Admin mở lại điểm rác đã được đánh dấu giải quyết.
   */
  async reopenTrashSpot(id: string): Promise<TrashSpotDetailDto> {
    const { data } = await apiClient.patch<TrashSpotDetailDto>(
      `/admin/trash-spots/${id}/reopen`,
    );
    return data;
  },

  /**
   * DELETE /api/v1/admin/trash-spots/{id}
   * Admin xoá điểm rác.
   */
  async deleteTrashSpot(id: string): Promise<void> {
    await apiClient.delete(`/admin/trash-spots/${id}`);
  },
};
