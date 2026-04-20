import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import {
  adminLeaderboardService,
  adminUserService,
  adminVoucherService,
} from "@/services/admin.service";
import { leaderboardService } from "@/services/gamification.service";
import {
  AdminVouchersQueryParams,
  LeaderboardPrizeQueryParams,
  LeaderboardScope,
} from "@/types/gamification.types";
import { AdminUserQueryParams } from "@/types/user.type";

export const useAdminUsers = (params?: AdminUserQueryParams) =>
  useQuery({
    queryKey: QUERY_KEYS.users.list(params),
    queryFn: () => adminUserService.getUsers(params),
  });

export const useAdminUserDetail = (id: string) =>
  useQuery({
    queryKey: QUERY_KEYS.users.detail(id),
    queryFn: () => adminUserService.getUserById(id),
    enabled: !!id,
  });

 // voucher
 export const useAdminVouchers = (params?: AdminVouchersQueryParams) =>
  useQuery({
    queryKey: QUERY_KEYS.admin.vouchers.list(params),
    queryFn: () => adminVoucherService.getVouchers(params),
  });


export const useWeeklyLeaderboard = () =>
  useQuery({
    queryKey: QUERY_KEYS.admin.leaderboard.weekly(),
    queryFn: () => {
      const currentDate = new Date().toISOString().split("T")[0];

      return leaderboardService
        .getLeaderboard(LeaderboardScope.NATIONAL, currentDate)
        .then((r) => r.entries);
    },
  });

export const useAdminPrizes = (params?: LeaderboardPrizeQueryParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.admin.prizes.list(params),
    queryFn: () => adminLeaderboardService.getPrizes(params),
  });
};

export const useAdminPrizeDetail = (id: string) =>
  useQuery({
    queryKey: QUERY_KEYS.admin.prizes.detail(id),
    queryFn: () => adminLeaderboardService.getPrizeById(id),
    enabled: !!id,
  });
