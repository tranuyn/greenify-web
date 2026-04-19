import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { adminLeaderboardService, adminUserService } from "@/services/admin.service";
import { leaderboardService } from "@/services/gamification.service";
import { LeaderboardScope } from "@/types/gamification.types";
import { AdminUserQueryParams } from "@/types/user.type";

export const useAdminUsers = (params?: AdminUserQueryParams) =>
  useQuery({
    queryKey: QUERY_KEYS.users.list(params),
    queryFn: () => adminUserService.getUsers(params),
    placeholderData: (prev) => prev, // Giữ data cũ khi đổi page/filter
  });

export const useAdminUserDetail = (id: string) =>
  useQuery({
    queryKey: QUERY_KEYS.users.detail(id),
    queryFn: () => adminUserService.getUserById(id),
    enabled: !!id,
  });
export const useWeeklyLeaderboard = () =>
  useQuery({
    queryKey: QUERY_KEYS.admin.leaderboard.weekly(),
    queryFn: () => 
      leaderboardService
        .getLeaderboard(LeaderboardScope.NATIONAL, new Date().toISOString())
        .then((r) => r.entries),
  });

export const useAdminPrizes = () =>
  useQuery({
    queryKey: QUERY_KEYS.admin.prizes.all,
    queryFn: () => adminLeaderboardService.getPrizes().then((r) => r.data),
  });

export const useAdminPrizeDetail = (id: string) =>
  useQuery({
    queryKey: QUERY_KEYS.admin.prizes.detail(id),
    queryFn: () => adminLeaderboardService.getPrizeById(id).then((r) => r.data),
    enabled: !!id,
  });
