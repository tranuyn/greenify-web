import { useMutation } from "@tanstack/react-query";
import { QUERY_KEYS } from "constants/queryKeys";
import { queryClient } from "lib/queryClient";
import { adminTrashSpotService } from "services/admin-trashspot.service";
import type { RejectResolveRequestBody } from "types/trashspot.types";

// Helper: invalidate tất cả admin trash-spot queries sau mỗi mutation
const invalidateAll = () =>
  queryClient.invalidateQueries({
    queryKey: QUERY_KEYS.admin.trashSpots.all,
  });

/**
 * POST /api/v1/admin/trash-spots/resolve-requests/{id}/approve
 */
export const useApproveResolveRequest = () => {
  return useMutation({
    mutationFn: (id: string) =>
      adminTrashSpotService.approveResolveRequest(id),
    onSuccess: invalidateAll,
  });
};

/**
 * POST /api/v1/admin/trash-spots/resolve-requests/{id}/reject
 */
export const useRejectResolveRequest = () => {
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: RejectResolveRequestBody;
    }) => adminTrashSpotService.rejectResolveRequest(id, payload),
    onSuccess: invalidateAll,
  });
};

/**
 * PATCH /api/v1/admin/trash-spots/{id}/reopen
 */
export const useReopenTrashSpot = () => {
  return useMutation({
    mutationFn: (id: string) => adminTrashSpotService.reopenTrashSpot(id),
    onSuccess: invalidateAll,
  });
};

/**
 * DELETE /api/v1/admin/trash-spots/{id}
 */
export const useDeleteTrashSpot = () => {
  return useMutation({
    mutationFn: (id: string) => adminTrashSpotService.deleteTrashSpot(id),
    onSuccess: invalidateAll,
  });
};
