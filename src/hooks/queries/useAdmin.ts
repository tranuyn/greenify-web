import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { adminLeaderboardService } from "@/services/admin.service";
import { leaderboardService } from "@/services/gamification.service";
import { LeaderboardScope } from "@/types/gamification.types";

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
