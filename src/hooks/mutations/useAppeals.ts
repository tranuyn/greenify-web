import { useMutation } from "@tanstack/react-query";
import { QUERY_KEYS } from "constants/queryKeys";
import { queryClient } from "lib/queryClient";
import { appealService } from "services/action.service";
import type { ReviewAppealRequest } from "types/action.types";

/**
 * POST /api/v1/green-action/appeals/{appealId}/review
 * Admin duyệt hoặc từ chối một appeal.
 * Tự động invalidate danh sách appeals sau khi thành công.
 */
export const useReviewAppeal = (appealId: string) => {
  return useMutation({
    mutationFn: (payload: ReviewAppealRequest) =>
      appealService.reviewAppeal(appealId, payload),
    onSuccess: () => {
      // Làm mới danh sách appeals + chi tiết appeal vừa duyệt
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.admin.appeals.all,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.admin.appeals.detail(appealId),
      });
    },
  });
};
