import { useMutation } from '@tanstack/react-query';
import { QUERY_KEYS } from 'constants/queryKeys';
import { queryClient } from 'lib/queryClient';
import { gamificationService, leaderboardService } from 'services/gamification.service';
import { CreatePlantDailyLogRequest } from 'types/gamification.types';

export const useExchangeVoucher = () => {
  return useMutation({
    mutationFn: (templateId: string) => gamificationService.exchangeVoucher(templateId),
    onSuccess: () => {
      // Điểm giảm + ví voucher thay đổi → invalidate cả hai
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wallet.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.vouchers.all });
    },
  });
};

export const useClaimLeaderboardReward = () => {
  return useMutation({
    mutationFn: (weekStartDate: string) => leaderboardService.claimLeaderboardReward(weekStartDate),
    onSuccess: (_response, weekStartDate) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.leaderboard.claim(weekStartDate) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.leaderboard.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.vouchers.mine() });
    },
  });
};

export const useCreatePlantDailyLog = () => {
  return useMutation({
    mutationFn: (payload: CreatePlantDailyLogRequest) => gamificationService.createPlantDailyLog(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.garden.dailyLogs() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.garden.active() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.streak.mine() });
    },
  });
};
