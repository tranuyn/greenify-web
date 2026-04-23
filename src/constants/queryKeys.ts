import { LeaderboardScope } from "@/types/gamification.types";

/**
 * Query Key Factory — dùng factory pattern thay vì string constants.
 *
 * Lợi ích:
 * - Tự động invalidate đúng scope (vd: invalidate toàn bộ 'posts' khi tạo post mới)
 * - Type-safe, không lo typo
 * - Dễ mở rộng khi thêm filter/pagination
 *
 * Cách dùng:
 *   queryKey: QUERY_KEYS.posts.feed()
 *   queryKey: QUERY_KEYS.posts.detail(postId)
 *   queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts.all })
 */
export const QUERY_KEYS = {
  admin: {
    vouchers: {
      all: ["admin", "vouchers"] as const,
      list: (params?: object) => ["admin", "vouchers", "list", params] as const,
      detail: (id: string) => ["admin", "vouchers", id] as const,
    },
    leaderboard: {
      weekly: (params?: {
        weekStartDate?: string;
        scope?: LeaderboardScope;
        province?: string;
      }) => ["admin", "leaderboard", "weekly", params] as const,
    },
    prizes: {
      all: ["admin", "leaderboard", "prizes"] as const,
      list: (params?: object) =>
        ["admin", "leaderboard", "prizes", "list", params] as const,
      detail: (id: string) => ["admin", "leaderboard", "prizes", id] as const,
    },
    appeals: {
      all: ["admin", "appeals"] as const,
      list: (params?: object) => ["admin", "appeals", "list", params] as const,
      detail: (id: string) => ["admin", "appeals", id] as const,
    },
    trashSpots: {
      all: ["admin", "trash-spots"] as const,
      list: (params?: object) =>
        ["admin", "trash-spots", "list", params] as const,
      resolveRequests: (params?: object) =>
        ["admin", "trash-spots", "resolve-requests", params] as const,
      reports: (params?: object) =>
        ["admin", "trash-spots", "reports", params] as const,
    },
  },

  // Auth
  auth: {
    all: ["auth"] as const,
    me: () => ["auth", "me"] as const,
  },

  // Users
  users: {
    all: ["users"] as const,
    list: (params?: object) => ["users", "list", params] as const,
    detail: (userId: string) => ["users", userId] as const,
  },

  // Posts
  posts: {
    all: ["posts"] as const,
    feed: (params?: object) => ["posts", "feed", params] as const,
    mine: (params?: object) => ["posts", "me", params] as const,
    detail: (postId: string) => ["posts", postId] as const,
    reviews: (postId: string) => ["posts", postId, "reviews"] as const,
    pendingReview: (params?: object) =>
      ["posts", "pending-review", params] as const,
  },

  // Action types (master data — stale lâu hơn)
  actionTypes: {
    all: ["action-types"] as const,
    detail: (id: string) => ["action-types", id] as const,
  },

  // Wallet & points
  wallet: {
    all: ["wallet"] as const,
    mine: () => ["wallet", "me"] as const,
    ledger: (params?: object) => ["wallet", "ledger", params] as const,
  },

  // Gamification
  streak: {
    mine: () => ["streak", "me"] as const,
  },
  garden: {
    all: ["garden"] as const,
    active: () => ["garden", "active"] as const,
    archives: () => ["garden", "archives"] as const,
    seeds: () => ["garden", "seeds"] as const,
    dailyLogs: (params?: object) => ["garden", "daily-logs", params] as const,
  },

  // Vouchers
  vouchers: {
    all: ["vouchers"] as const,
    available: () => ["vouchers", "available"] as const,
    mine: (params?: object) => ["vouchers", "me", params] as const,
    bySeed: (seedId: string) => ["vouchers", "by-seed", seedId] as const,
  },

  // Leaderboard
  leaderboard: {
    all: ["leaderboard"] as const,
    scope: (
      scope: LeaderboardScope,
      weekStartDate: string,
      province?: string,
    ) => ["leaderboard", scope, weekStartDate, province] as const,
    weeklyPrizes: (weekStartDate: string) =>
      ["leaderboard", "weekly-prizes", weekStartDate] as const,
    claim: (periodId: string) => ["leaderboard", "claim", periodId] as const,
  },

  // Events
  events: {
    all: ["events"] as const,
    list: (params?: object) => ["events", "list", params] as const,
    ngoList: (params?: object) => ["events", "ngo-list", params] as const,
    detail: (eventId: string) => ["events", eventId] as const,
    myRegistrations: (userId?: string, params?: object) =>
      ["events", "registrations", "me", userId, params] as const,
  },

  // Map
  stations: {
    all: ["stations"] as const,
    list: (params?: object) => ["stations", "list", params] as const,
    detail: (id: string) => ["stations", id] as const,
    wasteTypes: () => ["stations", "waste-types"] as const,
  },

  // Community
  trashReports: {
    all: ["trash-reports"] as const,
    list: (params?: object) => ["trash-reports", "list", params] as const,
  },

  // Location
  divisions: {
    provinces: ["divisions", "provinces"] as const,
    wards: (provinceCode: number) =>
      ["divisions", "wards", provinceCode] as const,
  },

  // Analytics
  analytics: {
    adminDashboard: (params?: object) =>
      ["analytics", "admin", "dashboard", params] as const,
    ngoDashboard: (params?: object) =>
      ["analytics", "ngo", "dashboard", params] as const,
  },
} as const;
