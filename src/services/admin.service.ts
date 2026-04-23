import { apiClient } from "@/lib/apiClient";
import type { ApiResponse, PageResponse } from "@/types/common.types";
import type {
  VoucherTemplate,
  CreateVoucherTemplateRequest,
  UpdateVoucherTemplateRequest,
  UpdateVoucherStatusRequest,
  LeaderboardPrize,
  CreateLeaderboardPrizeRequest,
  LeaderboardPrizeQueryParams,
  AvailableVouchersQueryParams,
  AvailableVouchersResponse,
  AdminVouchersQueryParams,
} from "@/types/gamification.types";
import { IS_MOCK_MODE, mockDelay, mockSuccess } from "./mock/config";
import {
  CreateActionTypeRequest,
  GreenActionType,
  UpdateActionTypeRequest,
} from "@/types/action.types";
import { MOCK_ACTION_TYPES } from "./mock/action.mock";
import {
  MOCK_PRIZES,
  MOCK_VOUCHER_TEMPLATES_ADMIN,
} from "./mock/gamification.mock";
import {
  AdminUserDto,
  AdminUserQueryParams,
  SuspendUserRequest,
  UpdateUserRoleRequest,
} from "@/types/user.type";
import { normalizeLockAtForApi } from "@/common/utils/date-time";
import { MOCK_ADMIN_USERS } from "./mock/user.mock";
import { EventQueryParams } from "@/types/community.types";

// ============================================================
// ADMIN USER SERVICE
// ============================================================
export const adminUserService = {
  async getUsers(
    params?: AdminUserQueryParams,
  ): Promise<PageResponse<AdminUserDto>> {

    const { data } = await apiClient.get<PageResponse<AdminUserDto>>("/users", {
      params: {
        page: params?.page ? params.page - 1 : 0, // Spring Boot zero-indexed
        size: params?.size ?? 10,
        search: params?.search || undefined,
        status: params?.status !== "ALL" ? params?.status : undefined,
        role: params?.role !== "ALL" ? params?.role : undefined,
      },
    });
    return data;
  },

  async getUserById(id: string): Promise<AdminUserDto> {
    if (IS_MOCK_MODE) {
      await mockDelay(300);
      const user = MOCK_ADMIN_USERS.find((u) => u.id === id);
      if (!user) throw new Error("User not found");
      return user;
    }
    const { data } = await apiClient.get<AdminUserDto>(`/users/${id}`);
    return data;
  },

  async suspendUser(id: string, payload: SuspendUserRequest): Promise<void> {
    // if (IS_MOCK_MODE) {
    //   await mockDelay(500);
    //   const idx = MOCK_ADMIN_USERS.findIndex((u) => u.id === id);
    //   if (idx !== -1) {
    //     MOCK_ADMIN_USERS[idx].status = "SUSPENDED";
    //     MOCK_ADMIN_USERS[idx].suspensionReason = payload.reason;
    //   }
    //   return;
    // }
    await apiClient.patch(`/users/${id}/suspend`, payload);
  },

  async unsuspendUser(id: string): Promise<void> {
    // if (IS_MOCK_MODE) {
    //   await mockDelay(400);
    //   const idx = MOCK_ADMIN_USERS.findIndex((u) => u.id === id);
    //   if (idx !== -1) {
    //     MOCK_ADMIN_USERS[idx].status = "ACTIVE";
    //     MOCK_ADMIN_USERS[idx].suspensionReason = null;
    //   }
    //   return;
    // }
    // Swagger chỉ có /suspend, unsuspend thường dùng lại endpoint đó với reason rỗng
    // hoặc có endpoint riêng — điều chỉnh theo BE thực tế
    await apiClient.patch(`/users/${id}/suspend`, { reason: "" });
  },

  async updateUserRole(
    id: string,
    payload: UpdateUserRoleRequest,
  ): Promise<void> {
    // if (IS_MOCK_MODE) {
    //   await mockDelay(400);
    //   const idx = MOCK_ADMIN_USERS.findIndex((u) => u.id === id);
    //   if (idx !== -1) {
    //     MOCK_ADMIN_USERS[idx].roles = [payload.roleName];
    //   }
    //   return;
    // }
    await apiClient.patch(`/users/${id}/role`, payload);
  },

  async demoteCTV(id: string): Promise<void> {
    if (IS_MOCK_MODE) {
      await mockDelay(400);
      const idx = MOCK_ADMIN_USERS.findIndex((u) => u.id === id);
      if (idx !== -1) {
        MOCK_ADMIN_USERS[idx].roles = ["USER"];
      }
      return;
    }
    await apiClient.patch(`/users/${id}/ctv-demotion`);
  },
};

// ============================================================
// ADMIN EVENTS SERVICE
// ============================================================
export const adminEventService = {
  async getEvents(params?: EventQueryParams): Promise<PageResponse<Event>> {
    const apiParams = {
      ...params,
      page: params?.page ? params.page - 1 : 0,
      size: params?.size ?? 10,
    };

    const { data } = await apiClient.get<PageResponse<Event>>("/events", {
      params: apiParams,
    });

    return data;
  },
};

// ============================================================
// ADMIN ACTION SERVICE
// ============================================================
export const adminActionService = {
  async createActionType(
    payload: CreateActionTypeRequest,
  ): Promise<GreenActionType> {
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
  async getVouchers(
    params?: AdminVouchersQueryParams,
  ): Promise<AvailableVouchersResponse> {
    const { data } = await apiClient.get<AvailableVouchersResponse>(
      "/admin/vouchers",
      {
        params: {
          page: params?.page ? params.page - 1 : 0,
          size: params?.size ?? 20,
          status: params?.status && params.status !== "ALL" ? params.status : undefined,
        },
      },
    );
    return data;
  },

  async createVoucher(
    payload: CreateVoucherTemplateRequest,
  ): Promise<VoucherTemplate> {
    // if (IS_MOCK_MODE) {
    //   await mockDelay(700);

    //   const newVoucher: VoucherTemplate = {
    //     id: `vt-${Date.now()}`,
    //     name: payload.name,
    //     partnerName: payload.partnerName,
    //     description: payload.description,
    //     requiredPoints: payload.requiredPoints,
    //     totalStock: payload.totalStock,
    //     remainingStock: payload.totalStock, // Mới tạo thì còn nguyên kho
    //     usageConditions: payload.usageConditions,
    //     validUntil: payload.validUntil,
    //     status: "DRAFT",
    //     // Map từ Object thành String để render UI
    //     partnerLogoUrl: payload.partnerLogo?.imageUrl || null,
    //     thumbnailUrl: payload.thumbnail?.imageUrl || null,
    //   };
    //   MOCK_VOUCHER_TEMPLATES_ADMIN.push(newVoucher);
    //   return mockSuccess(newVoucher);
    // }

    const { data } = await apiClient.post<VoucherTemplate>(
      "/admin/vouchers",
      payload,
    );
    return data;
  },

  async updateVoucher(
    id: string,
    payload: UpdateVoucherTemplateRequest,
  ): Promise<VoucherTemplate> {

    const { data } = await apiClient.patch<VoucherTemplate>(
      `/admin/vouchers/${id}`,
      payload,
    );
    return data;
  },

  async updateVoucherStatus(
    id: string,
    payload: UpdateVoucherStatusRequest,
  ): Promise<VoucherTemplate> {
    const { data } = await apiClient.patch<VoucherTemplate>(
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
  async getPrizes(
    params?: LeaderboardPrizeQueryParams,
  ): Promise<PageResponse<LeaderboardPrize>> {
    const apiParams = {
      weekStartDate: params?.weekStartDate,
      status: params?.status === "ALL" ? undefined : params?.status,
      page: params?.page ? params.page - 1 : 0,
      size: params?.size ?? 10,
    };

    // 2. Gọi API với kiểu trả về là PageResponse
    const { data } = await apiClient.get<PageResponse<LeaderboardPrize>>(
      "/admin/leaderboard/prizes",
      {
        params: apiParams,
      },
    );

    return data;
  },

  async getPrizeById(id: string): Promise<LeaderboardPrize> {
    const { data } = await apiClient.get<LeaderboardPrize>(
      `/admin/leaderboard/prizes/${id}`,
    );
    return data;
  },

  async createPrize(
    payload: CreateLeaderboardPrizeRequest,
  ): Promise<LeaderboardPrize> {
    const normalizedPayload: CreateLeaderboardPrizeRequest = {
      ...payload,
      lockAt: normalizeLockAtForApi(payload.lockAt),
    };

    const { data } = await apiClient.post<LeaderboardPrize>(
      "/admin/leaderboard/prizes",
      normalizedPayload,
    );
    return data;
  },

  async distributePrize(id: string): Promise<ApiResponse<null>> {
    const { data } = await apiClient.post<ApiResponse<null>>(
      `/admin/leaderboard/prizes/${id}/distribute`,
    );
    return data;
  },

  async deletePrize(id: string): Promise<ApiResponse<null>> {
    const { data } = await apiClient.delete<ApiResponse<null>>(
      `/admin/leaderboard/prizes/${id}`,
    );
    return data;
  },
};
