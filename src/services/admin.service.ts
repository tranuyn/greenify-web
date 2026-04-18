import { apiClient } from "@/lib/apiClient";
import type { ApiResponse } from "@/types/common.types";
import type {
  VoucherTemplate,
  CreateVoucherTemplateRequest,
  UpdateVoucherTemplateRequest,
  UpdateVoucherStatusRequest,
  LeaderboardPrize,
  CreateLeaderboardPrizeRequest,
} from "@/types/gamification.types";
import { IS_MOCK_MODE, mockDelay, mockSuccess } from "./mock/config";
import {
  CreateActionTypeRequest,
  GreenActionType,
  UpdateActionTypeRequest,
} from "@/types/action.types";
import { MOCK_ACTION_TYPES } from "./mock/action.mock";
import { MOCK_PRIZES, MOCK_VOUCHER_TEMPLATES_ADMIN } from "./mock/gamification.mock";


// ============================================================
// ADMIN ACTION SERVICE
// ============================================================
export const adminActionService = {
  async createActionType(
    payload: CreateActionTypeRequest,
  ): Promise<GreenActionType> {
    if (IS_MOCK_MODE) {
      await mockDelay(600);

      const newAction: GreenActionType = {
        id: `act-${Date.now()}`,
        ...payload,
      };

      MOCK_ACTION_TYPES.unshift(newAction);

      return newAction;
    }
    const { data } = await apiClient.post<GreenActionType>(
      "/admin/green-action/action-types",
      payload,
    );
    return data;
  },
  async updateActionType(
    id: string,
    payload: UpdateActionTypeRequest,
  ): Promise<GreenActionType> {
    if (IS_MOCK_MODE) {
      await mockDelay(500);

      const idx = MOCK_ACTION_TYPES.findIndex((a) => a.id === id);
      if (idx === -1) throw new Error("Action type not found");

      // Ghi đè dữ liệu mới lên dữ liệu cũ
      const updatedAction: GreenActionType = {
        ...MOCK_ACTION_TYPES[idx],
        ...payload,
      };

      MOCK_ACTION_TYPES[idx] = updatedAction;
      return updatedAction;
    }

    const { data } = await apiClient.patch<GreenActionType>(
      `/admin/green-action/action-types/${id}`,
      payload,
    );

    return { ...data, id };
  },
};

// ============================================================
// ADMIN VOUCHER SERVICE
// ============================================================
export const adminVoucherService = {
  async createVoucher(
    payload: CreateVoucherTemplateRequest,
  ): Promise<ApiResponse<VoucherTemplate>> {
    if (IS_MOCK_MODE) {
      await mockDelay(700);

      const newVoucher: VoucherTemplate = {
        id: `vt-${Date.now()}`,
        name: payload.name,
        partnerName: payload.partnerName,
        description: payload.description,
        requiredPoints: payload.requiredPoints,
        totalStock: payload.totalStock,
        remainingStock: payload.totalStock, // Mới tạo thì còn nguyên kho
        usageConditions: payload.usageConditions,
        validUntil: payload.validUntil,
        status: "DRAFT",
        // Map từ Object thành String để render UI
        partnerLogoUrl: payload.partnerLogo?.imageUrl || null,
        thumbnailUrl: payload.thumbnail?.imageUrl || null,
      };
      MOCK_VOUCHER_TEMPLATES_ADMIN.push(newVoucher);
      return mockSuccess(newVoucher);
    }

    const { data } = await apiClient.post<ApiResponse<VoucherTemplate>>(
      "/admin/vouchers",
      payload,
    );
    return data;
  },

  async updateVoucher(
    id: string,
    payload: UpdateVoucherTemplateRequest,
  ): Promise<ApiResponse<VoucherTemplate>> {
    // 1. XỬ LÝ MOCK DATA
    if (IS_MOCK_MODE) {
      await mockDelay(600);
      const idx = MOCK_VOUCHER_TEMPLATES_ADMIN.findIndex((v) => v.id === id);
      if (idx === -1) throw new Error("Voucher not found");

      const currentVoucher = MOCK_VOUCHER_TEMPLATES_ADMIN[idx];

      // Logic tính toán kho: Cộng dồn nếu có nhập thêm
      const addedStock = payload.additionalStock || 0;

      const updatedVoucher: VoucherTemplate = {
        ...currentVoucher,
        ...payload, // Đè các field cơ bản (name, description, status...)

        // Cập nhật kho
        totalStock: currentVoucher.totalStock + addedStock,
        remainingStock: currentVoucher.remainingStock + addedStock,

        // Bóc tách Object ảnh ra thành dạng String cho UI render
        partnerLogoUrl:
          payload.partnerLogo !== undefined
            ? payload.partnerLogo?.imageUrl || null
            : currentVoucher.partnerLogoUrl,
        thumbnailUrl:
          payload.thumbnail !== undefined
            ? payload.thumbnail?.imageUrl || null
            : currentVoucher.thumbnailUrl,
      };

      MOCK_VOUCHER_TEMPLATES_ADMIN[idx] = updatedVoucher;
      return mockSuccess(updatedVoucher);
    }

    // 2. GỌI API THẬT
    const { data } = await apiClient.patch<ApiResponse<VoucherTemplate>>(
      `/admin/vouchers/${id}`,
      payload,
    );
    return data;
  },

  async updateVoucherStatus(
    id: string,
    payload: UpdateVoucherStatusRequest,
  ): Promise<ApiResponse<VoucherTemplate>> {
    // 1. XỬ LÝ MOCK DATA
    if (IS_MOCK_MODE) {
      await mockDelay(400);
      const idx = MOCK_VOUCHER_TEMPLATES_ADMIN.findIndex((v) => v.id === id);
      if (idx === -1) throw new Error("Voucher not found");

      // Cập nhật trạng thái
      MOCK_VOUCHER_TEMPLATES_ADMIN[idx].status = payload.status;

      return mockSuccess(MOCK_VOUCHER_TEMPLATES_ADMIN[idx]);
    }

    // 2. GỌI API THẬT
    const { data } = await apiClient.patch<ApiResponse<VoucherTemplate>>(
      `/admin/vouchers/${id}/status`,
      null,
      {
        params: {
          status: payload.status,
        },
      },
    );
    return data;
  },
};

// ============================================================
// ADMIN LEADERBOARD SERVICE
// ============================================================
export const adminLeaderboardService = {
  async getPrizes(): Promise<ApiResponse<LeaderboardPrize[]>> {
    if (IS_MOCK_MODE) {
      await mockDelay(400);
      return mockSuccess(MOCK_PRIZES);
    }
    const { data } = await apiClient.get<ApiResponse<LeaderboardPrize[]>>(
      "/admin/leaderboard/prizes",
    );
    return data;
  },

  async getPrizeById(id: string): Promise<ApiResponse<LeaderboardPrize>> {
    if (IS_MOCK_MODE) {
      await mockDelay(300);
      const prize = MOCK_PRIZES.find((p) => p.id === id);
      if (!prize) throw new Error("Prize not found");
      return mockSuccess(prize);
    }
    const { data } = await apiClient.get<ApiResponse<LeaderboardPrize>>(
      `/admin/leaderboard/prizes/${id}`,
    );
    return data;
  },

  async createPrize(
    payload: CreateLeaderboardPrizeRequest,
  ): Promise<ApiResponse<LeaderboardPrize>> {
    if (IS_MOCK_MODE) {
      await mockDelay(600);
      const template = MOCK_VOUCHER_TEMPLATES_ADMIN.find(
        (v) => v.id === payload.voucherTemplateId,
      );
      const newPrize: LeaderboardPrize = {
        id: `prize-${Date.now()}`,
        createdAt: new Date().toISOString(),
        voucherTemplate: template,
        ...payload,
      };
      MOCK_PRIZES.push(newPrize);
      return mockSuccess(newPrize);
    }
    const { data } = await apiClient.post<ApiResponse<LeaderboardPrize>>(
      "/admin/leaderboard/prizes",
      payload,
    );
    return data;
  },

  async distributePrize(id: string): Promise<ApiResponse<null>> {
    if (IS_MOCK_MODE) {
      await mockDelay(800);
      return mockSuccess(null);
    }
    const { data } = await apiClient.post<ApiResponse<null>>(
      `/admin/leaderboard/prizes/${id}/distribute`,
    );
    return data;
  },

  async deletePrize(id: string): Promise<ApiResponse<null>> {
    if (IS_MOCK_MODE) {
      await mockDelay(500);
      const idx = MOCK_PRIZES.findIndex((p) => p.id === id);
      if (idx !== -1) MOCK_PRIZES.splice(idx, 1);
      return mockSuccess(null);
    }
    const { data } = await apiClient.delete<ApiResponse<null>>(
      `/admin/leaderboard/prizes/${id}`,
    );
    return data;
  },
};
