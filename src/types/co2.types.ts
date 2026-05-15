// ============================================================
// CO2 IMPACT TYPES
// Mapped from endpoints:
//   GET /wallet/co2e
//   GET /posts/{postId}/co2e
//   GET /me/co2e-history
// ============================================================

import { PaginationParams } from "./common.types";
import { GreenActionPostDetailDto } from "./action.types";

// ---- Enums ----

export type Co2eStatus = "PENDING" | "CREDITED" | "SKIPPED";

export type Co2eType = "AVOIDED" | "ABSORBED";

// ---- Response DTOs ----

/**
 * Tổng quan CO2 từ ví (GET /wallet/co2e)
 */
export interface Co2WalletSummary {
  totalAvoidedKg: number;
  totalAbsorbedKg: number;
  totalCo2eKg: number;
}

/**
 * Chi tiết CO2 của 1 bài đăng (GET /posts/{postId}/co2e)
 */
export interface PostCo2e {
  postId: string;
  status: Co2eStatus;
  co2eKg: number;
  materialCode: string;
  materialLabel: string;
  skipReason: string;
}

/**
 * Một mục trong lịch sử CO2 (GET /me/co2e-history)
 */
export interface Co2eHistoryItem {
  post: GreenActionPostDetailDto;
  materialCode: string;
  materialLabel: string;
  co2eType: Co2eType;
  co2eKg: number;
  confidenceScore: number;
  creditedAt: string; // ISO 8601
}

// ---- Query Params ----

export interface Co2eHistoryQueryParams extends PaginationParams {}

// ---- Admin Analytics DTOs ----

export interface AdminCo2eQueryParams {
  startDate: string; // yyyy-MM-dd
  endDate: string; // yyyy-MM-dd
}

export interface AdminCo2eMetrics {
  totalCo2eKg: number;
  totalAvoidedKg: number;
  totalAbsorbedKg: number;
}

export interface AdminCo2eMonthlyBreakdown extends AdminCo2eMetrics {
  month: string;
}

export interface AdminCo2eAnalyticsResponse {
  totalMetrics: AdminCo2eMetrics;
  monthlyBreakdown: AdminCo2eMonthlyBreakdown[];
}
