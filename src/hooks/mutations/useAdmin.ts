import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminVoucherService,
  adminLeaderboardService,
  adminActionService,
  adminUserService,
} from "@/services/admin.service";
import type {
  CreateVoucherTemplateRequest,
  UpdateVoucherTemplateRequest,
  UpdateVoucherStatusRequest,
  CreateLeaderboardPrizeRequest,
} from "@/types/gamification.types";
import {
  CreateActionTypeRequest,
  UpdateActionTypeRequest,
} from "@/types/action.types";
import { QUERY_KEYS } from "@/constants/queryKeys";
import {
  SuspendUserRequest,
  UpdateUserRoleRequest,
} from '@/types/user.type';

// ── User mutations ───────────────────────────────────────────
export const useSuspendUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: SuspendUserRequest }) =>
      adminUserService.suspendUser(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.users.all }),
  });
};

export const useUnsuspendUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminUserService.unsuspendUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.users.all }),
  });
};

export const useUpdateUserRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserRoleRequest }) =>
      adminUserService.updateUserRole(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.users.all }),
  });
};

export const useDemoteCTV = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminUserService.demoteCTV(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.users.all }),
  });
};

// ── Action Type mutations ─────────────────────────────────────
export const useCreateActionType = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateActionTypeRequest) =>
      adminActionService.createActionType(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.actionTypes.all });
    },
  });
};

export const useUpdateActionType = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateActionTypeRequest;
    }) => adminActionService.updateActionType(id, payload),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.actionTypes.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.actionTypes.detail(variables.id) });
    },
  });
};

// ── Voucher mutations ──────────────────────────────────────────
export const useCreateVoucher = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: CreateVoucherTemplateRequest) =>
      adminVoucherService.createVoucher(p),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: QUERY_KEYS.admin.vouchers.all }),
  });
};

export const useUpdateVoucher = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateVoucherTemplateRequest;
    }) => adminVoucherService.updateVoucher(id, payload),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.admin.vouchers.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.admin.vouchers.detail(variables.id) });
    },
  });
};

export const useUpdateVoucherStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateVoucherStatusRequest;
    }) => adminVoucherService.updateVoucherStatus(id, payload),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.admin.vouchers.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.admin.vouchers.detail(variables.id) });
    },
  });
};

// ── Prize mutations ────────────────────────────────────────────
export const useCreatePrize = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: CreateLeaderboardPrizeRequest) =>
      adminLeaderboardService.createPrize(p),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: QUERY_KEYS.admin.prizes.all }),
  });
};

export const useDistributePrize = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminLeaderboardService.distributePrize(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.admin.prizes.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.admin.prizes.detail(id) });
    },
  });
};

export const useDeletePrize = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminLeaderboardService.deletePrize(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.admin.prizes.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.admin.prizes.detail(id) });
    },
  });
};
