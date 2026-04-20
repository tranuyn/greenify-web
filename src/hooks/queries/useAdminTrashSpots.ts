import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "constants/queryKeys";
import { adminTrashSpotService } from "services/admin-trashspot.service";
import type {
  AdminTrashSpotsParams,
  AdminResolveRequestsParams,
  AdminTrashReportsParams,
} from "types/trashspot.types";

/**
 * GET /api/v1/admin/trash-spots
 * Danh sách tất cả điểm rác với đầy đủ filter.
 */
export const useAdminTrashSpots = (params?: AdminTrashSpotsParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.admin.trashSpots.list(params),
    queryFn: () => adminTrashSpotService.getTrashSpots(params),
  });
};

/**
 * GET /api/v1/admin/trash-spots/resolve-requests
 * Danh sách yêu cầu giải quyết của NGO.
 */
export const useAdminResolveRequests = (
  params?: AdminResolveRequestsParams,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.admin.trashSpots.resolveRequests(params),
    queryFn: () => adminTrashSpotService.getResolveRequests(params),
  });
};

/**
 * GET /api/v1/admin/trash-spots/reports
 * Danh sách báo cáo điểm rác từ người dùng.
 */
export const useAdminTrashReports = (params?: AdminTrashReportsParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.admin.trashSpots.reports(params),
    queryFn: () => adminTrashSpotService.getTrashReports(params),
  });
};
