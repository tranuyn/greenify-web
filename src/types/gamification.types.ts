// ============================================================
// VOUCHER TYPES
// Mapped from: voucher_templates, user_vouchers
// ============================================================
import { PageResponse, PaginationParams } from "./common.types";
import { MediaDto } from "./media.types";

export const VOUCHER_TEMPLATE_STATUS = {
  DRAFT: "DRAFT",
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  EXPIRED: "EXPIRED",
  DEPLETED: "DEPLETED",
} as const;

export type VoucherTemplateStatus =
  (typeof VOUCHER_TEMPLATE_STATUS)[keyof typeof VOUCHER_TEMPLATE_STATUS];

export const ADMIN_VOUCHER_STATUS_FILTER = {
  ALL: "ALL",
  ...VOUCHER_TEMPLATE_STATUS,
} as const;

export type AdminVoucherStatus =
  (typeof ADMIN_VOUCHER_STATUS_FILTER)[keyof typeof ADMIN_VOUCHER_STATUS_FILTER];

export const ADMIN_VOUCHER_STATUS_FILTERS: readonly AdminVoucherStatus[] = [
  ADMIN_VOUCHER_STATUS_FILTER.ALL,
  ADMIN_VOUCHER_STATUS_FILTER.ACTIVE,
  ADMIN_VOUCHER_STATUS_FILTER.INACTIVE,
  ADMIN_VOUCHER_STATUS_FILTER.DRAFT,
  ADMIN_VOUCHER_STATUS_FILTER.DEPLETED,
  ADMIN_VOUCHER_STATUS_FILTER.EXPIRED,
];

export const USER_VOUCHER_STATUS = {
  AVAILABLE: "AVAILABLE",
  USED: "USED",
  EXPIRED: "EXPIRED",
  CANCELLED: "CANCELLED",
} as const;

export type UserVoucherStatus = keyof typeof USER_VOUCHER_STATUS;

export type VoucherSource = "REDEEM" | "LEADERBOARD_REWARD" | "GARDEN_REWARD";

export interface VoucherTemplate {
  id: string;
  name: string;
  partnerName: string;
  partnerLogoUrl: string | null;
  thumbnailUrl: string | null;
  description: string;
  requiredPoints: number;
  totalStock: number;
  remainingStock: number;
  usageConditions: string;
  validUntil: string;
  status: VoucherTemplateStatus;
}
export interface AvailableVouchersResponse {
  availablePoints: number;
  content: VoucherTemplate[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
export interface AvailableVouchersQueryParams extends PaginationParams {
  minRequiredPoints?: number;
  maxRequiredPoints?: number;
}
export interface AdminVouchersQueryParams extends PaginationParams {
  status?: AdminVoucherStatus;
}

export interface CreateVoucherTemplateRequest {
  name: string;
  partnerName: string;
  description: string;
  requiredPoints: number;
  totalStock: number;
  usageConditions: string;
  validUntil: string; // ISO 8601
  partnerLogo: MediaDto | null;
  thumbnail: MediaDto | null;
}

// Request body cho PATCH /api/v1/admin/vouchers/{id}
export interface UpdateVoucherTemplateRequest {
  name?: string;
  partnerName?: string;
  description?: string;
  requiredPoints?: number;
  additionalStock?: number;
  usageConditions?: string;
  validUntil?: string; // ISO 8601
  status?: VoucherTemplateStatus;
  partnerLogo?: MediaDto | null;
  thumbnail?: MediaDto | null;
}

// Request body cho PATCH /api/v1/admin/vouchers/{id}/status
export interface UpdateVoucherStatusRequest {
  status: VoucherTemplateStatus;
}

export interface UserVoucher {
  id: string;
  voucherCode: string;
  voucherTemplateId: string;
  voucherName: string;
  partnerName: string;
  partnerLogoUrl: string | null;
  description: string;
  usageConditions: string;
  thumbnailUrl: string | null;
  expiresAt: string;
  usedAt: string | null;
  status: UserVoucherStatus;
  source: VoucherSource;
}

export interface MyVouchersQueryParams extends PaginationParams {
  status?: UserVoucherStatus | "all";
  source?: VoucherSource | "all";
}

// ============================================================
// STREAK & GARDEN TYPES
// Mapped from: streaks, seeds, plant_progresses, garden_archives
// ============================================================

export type StreakStatus = "NOT_STARTED" | "ACTIVE" | "BROKEN";

export enum PlantStatus {
  SEED = "SEED",
  SPROUT = "SPROUT",
  GROWING = "GROWING",
  BLOOMING = "BLOOMING",
  MATURED = "MATURED",
}

export enum CycleType {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
}

export type GardenRewardStatus = "MATURED" | "REWARDED";

export interface Streak {
  currentStreak: number;
  longestStreak: number;
  lastValidDate: string | null;
  status: StreakStatus;
  restoreUsedThisMonth: number;
  restoreAvailable: true;
  // restore_month: string | null;
  // last_break_date: string | null;
  // broken_streak: number;
  // updated_at: string;
}

export interface Seed {
  id: string;
  name: string;
  stage1ImageUrl: string;
  stage2ImageUrl: string;
  stage3ImageUrl: string;
  stage4ImageUrl: string;
  daysToMature: number;
  stage2FromDay: number;
  stage3FromDay: number;
  stage4FromDay: number;
  rewardVoucherTemplateId: string | null;
  rewardVoucherName: string;
  //reward_voucher_template?: VoucherTemplate;
  cycleType: CycleType;
  is_active: boolean;
}

export interface PlantProgress {
  seedId: string;
  seedName: string;
  progress_days: number;
  daysToMature: number;
  status: PlantStatus;
  cycleType: CycleType;
  currentStage: PlantStatus;
  currentStageImageUrl: string;
  started_at: string;
  percentComplete: number;
}

export interface PlantDailyLog {
  //id: string;
  //user_id: string;
  //user: UserProfile;
  //plant_progress_id: string;
  //plant_progress: PlantProgress;
  logDate: Date;
  stage: PlantStatus;
  is_active_day: boolean;
  isChangeState: boolean;
  greenPostUrl: string;
  imageUrl: string;
  //created_at: string;
}

export interface PlantDailyLogQueryParams {
  plant_progress_id?: string;
  user_id?: string;
  from_date?: string;
  to_date?: string;
  log_date?: string;
}

export interface CreatePlantDailyLogRequest {
  plant_progress_id: string;
  log_date: string;
  stage: PlantStatus;
  is_active_day: boolean;
  green_post_url?: string;
  image_url?: string;
}

export interface GardenArchive {
  id: string;
  user_id: string;
  seed_id: string;
  plant_progress_id: string;
  days_taken: number;
  reward_status: GardenRewardStatus;
  display_image_url: string;
  user_voucher_id: string | null;
  archived_at: string;
  // Joined
  seed?: Seed;
  plant_progress?: PlantProgress;
}

// ============================================================
// LEADERBOARD TYPES
// Mapped from: leaderboard_periods, leaderboard_snapshots
// ============================================================

export enum LeaderboardScope {
  NATIONAL = "NATIONAL",
  PROVINCIAL = "PROVINCIAL",
}

export type LeaderboardPeriodStatus = "DRAFT" | "PUBLISHED" | "CLOSED";

export type SnapshotStatus = "COMPUTING" | "PUBLISHED" | "REVISED";

export type RewardStatus = "PENDING_REWARD" | "REWARDED" | "FAILED";

export interface LeaderboardPeriod {
  id: string;
  week_start: string; // "YYYY-MM-DD"
  week_end: string;
  lock_at: string;
  national_reward_config: Record<number, string>; // rank → voucher_template_id
  provincial_reward_config: Record<number, string>;
  status: LeaderboardPeriodStatus;
}

export interface WeeklyLeaderboard {
  weekStartDate: string; // YYYY-MM-DD
  scope: LeaderboardScope;
  province: string | null;
  entries: LeaderboardEntry[];
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  province: string;
  weeklyPoints: number;
}

export interface LeaderboardPrize {
  id: string;
  weekStartDate: string;
  lockAt: string;
  status: LeaderboardPrizeStatus;
  nationalVoucher: VoucherTemplate;
  provincialVoucher: VoucherTemplate;
  nationalReservedCount: number;
  provincialReservedCount: number;
  distributedAt: string | null;
  createdAt: string;
  lastModifiedAt: string;
}

export interface CreateLeaderboardPrizeRequest {
  weekStartDate: string; // YYYY-MM-DD
  lockAt: string;
  nationalVoucherTemplateId: string;
  provincialVoucherTemplateId: string;
}

export interface WeeklyLeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  weeklyPoints: number;
  province?: string | null;
}

export interface WeeklyLeaderboardPrize {
  rank: number;
  voucherName: string;
  quantity: number;
}
export type LeaderboardPrizeStatus = "CONFIGURED" | "DISTRIBUTED" | "CANCELLED";

export interface WeeklyLeaderboardPrizes {
  prizeConfigId: string;
  weekStartDate: string; // YYYY-MM-DD
  lockAt: string;
  status: LeaderboardPrizeStatus;
  nationalReservedCount: number;
  provincialReservedCount: number;
  distributedAt: string | null;
  nationalVoucher: VoucherTemplate;
  provincialVoucher: VoucherTemplate;
}
export interface LeaderboardPrizeQueryParams extends PaginationParams {
  weekStartDate?: string;
  status?: LeaderboardPrizeStatus | "ALL";
}
