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
  // async getTrashSpots(
  //   params?: AdminTrashSpotsParams,
  // ): Promise<PageResponse<TrashSpotSummaryDto>> {
  //   const { data } = await apiClient.get<PageResponse<TrashSpotSummaryDto>>(
  //     "/admin/trash-spots",
  //     { params: { ...params, page: params?.page ?? 0, size: params?.size ?? 20 } },
  //   );
  //   return data;
  // },
  async getTrashSpots(
    params?: AdminTrashSpotsParams,
  ): Promise<PageResponse<TrashSpotSummaryDto>> {
    const page = params?.page ?? 0;
    const size = params?.size ?? 20;

    // Ép kiểu any tạm thời để hứng cả 2 trường hợp: Array hoặc PageResponse
    const { data } = await apiClient.get<any>(
      "/admin/trash-spots",
      { 
        params: { 
          ...params,
          // Mẹo: Nếu BE đang dump nguyên mảng, đôi khi truyền page/size xuống BE sẽ bị lỗi. 
          // Nếu lỗi, bạn thử comment 2 dòng dưới lại để BE ném hết data lên đây rồi FE tự cắt.
          page, 
          size 
        } 
      },
    );

    // TRƯỜNG HỢP 1: BE đã lén fix xong và trả về đúng format phân trang có 'content'
    if (data && !Array.isArray(data) && "content" in data) {
      return data as PageResponse<TrashSpotSummaryDto>;
    }

    // TRƯỜNG HỢP 2: BE vẫn ngoan cố trả về mảng thuần -> Frontend tự phân trang
    const rawArray: TrashSpotSummaryDto[] = Array.isArray(data) ? data : [];
    
    // Tính toán các thông số phân trang
    const totalElements = rawArray.length;
    const totalPages = Math.ceil(totalElements / size);

    // CẮT MẢNG (Slicing): Lấy đúng số item cho trang hiện tại
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const content = rawArray.slice(startIndex, endIndex);

    // Đóng gói trả về giống hệt cấu trúc PageResponse
    return {
      content,
      page,
      size,
      totalElements,
      totalPages,
      // Thêm các trường phụ nếu interface PageResponse của bạn yêu cầu
      // first: page === 0,
      // last: page >= totalPages - 1,
      // empty: content.length === 0,
    };
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
