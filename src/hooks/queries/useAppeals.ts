import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "constants/queryKeys";
import { appealService } from "services/action.service";
import type { AppealReviewParams } from "types/action.types";

/**
 * GET /api/v1/green-action/appeals/review
 * Danh sách appeals cho admin xét duyệt.
 */
export const useAppealsForReview = (params?: AppealReviewParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.admin.appeals.list(params),
    queryFn: () => appealService.getAppealsForReview(params),
  });
};

/**
 * GET /api/v1/green-action/appeals/{appealId}
 * Chi tiết một appeal.
 */
export const useAppealDetail = (appealId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.admin.appeals.detail(appealId),
    queryFn: () => appealService.getAppealById(appealId),
    enabled: !!appealId,
  });
};
