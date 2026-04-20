// --- PARAMS ---
export interface AnalyticsQueryParams {
  startDate?: string; // Định dạng YYYY-MM-DD
  endDate?: string;   // Định dạng YYYY-MM-DD
}

// ==========================================
// 1. NGO DASHBOARD TYPES
// ==========================================
export interface NgoTotalMetrics {
  totalEvents: number;
  totalParticipants: number;
  averageAttendanceRate: number;
}

export interface NgoMonthlyBreakdown {
  month: string;
  totalEvents: number;
  totalParticipants: number;
}

export interface NgoDashboardResponse {
  totalMetrics: NgoTotalMetrics;
  monthlyBreakdown: NgoMonthlyBreakdown[];
}

// ==========================================
// 2. ADMIN DASHBOARD TYPES
// ==========================================
export interface AdminTotalMetrics {
  newUsers: number;
  verifiedPosts: number;
  pointsIssued: number;
  vouchersRedeemed: number;
  eventAttendance: number;
  trashResolved: number;
}

export interface AdminMonthlyBreakdown {
  month: string;
  verifiedPosts: number;
  eventAttendance: number;
  trashResolved: number;
}

export interface AdminDashboardResponse {
  totalMetrics: AdminTotalMetrics;
  monthlyBreakdown: AdminMonthlyBreakdown[];
}