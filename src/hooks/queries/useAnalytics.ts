import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { analystService } from "@/services/analytics.service";
import type {
  AdminDashboardResponse,
  AnalyticsQueryParams,
  LandingStatsResponse,
  NgoDashboardResponse,
} from "@/types/analytics.types";
import { useAdminUsers } from "@/hooks/queries/useAdmin";
import { useEvents } from "@/hooks/queries/useEvents";
import { usePendingReviewPosts } from "@/hooks/queries/usePosts";
import { useStations } from "@/hooks/queries/useStations";
import { useTrashReports } from "@/hooks/queries/useTrashReports";

export const useAdminDashboardAnalytics = (params?: AnalyticsQueryParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.analytics.adminDashboard(params),
    queryFn: () => analystService.getAdminDashboard(params),
  });
};

export const useLandingStats = () => {
  return useQuery<LandingStatsResponse>({
    queryKey: QUERY_KEYS.analytics.landingStats(),
    queryFn: () => analystService.getLandingStats(),
  });
};

export const useNgoDashboardAnalytics = (params?: AnalyticsQueryParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.analytics.ngoDashboard(params),
    queryFn: () => analystService.getNgoDashboard(params),
  });
};

export const useAdminDashboardOverview = (params?: AnalyticsQueryParams) => {
  const analyticsQuery = useAdminDashboardAnalytics(params);

  // Borrow extra signals from existing hooks/services for richer dashboard metrics.
  const usersQuery = useAdminUsers({ page: 1, size: 4 });
  const eventsQuery = useEvents({ page: 1, size: 4, sort: ["createdAt,desc"] });
  const pendingEventsQuery = useEvents({
    page: 1,
    size: 1,
    statuses: ["APPROVAL_WAITING"],
  });
  const pendingPostsQuery = usePendingReviewPosts({ page: 1, size: 1 });
  const stationsQuery = useStations();
  const trashReportsQuery = useTrashReports({ page: 1, size: 1 });

  const totals = useMemo(() => {
    const analytics = analyticsQuery.data?.totalMetrics;

    return {
      totalUsers: usersQuery.data?.totalElements ?? 0,
      totalEvents: eventsQuery.data?.totalElements ?? 0,
      verifiedPosts: analytics?.verifiedPosts ?? 0,
      pointsIssued: analytics?.pointsIssued ?? 0,
      vouchersRedeemed: analytics?.vouchersRedeemed ?? 0,
      eventAttendance: analytics?.eventAttendance ?? 0,
      trashResolved: analytics?.trashResolved ?? 0,
      pendingPosts: pendingPostsQuery.data?.totalElements ?? 0,
      pendingEvents: pendingEventsQuery.data?.totalElements ?? 0,
      totalTrashReports: trashReportsQuery.data?.totalElements ?? 0,
      activeStations:
        stationsQuery.data?.filter((station) => station.status === "ACTIVE")
          .length ?? 0,
    };
  }, [
    analyticsQuery.data,
    usersQuery.data,
    eventsQuery.data,
    pendingPostsQuery.data,
    pendingEventsQuery.data,
    trashReportsQuery.data,
    stationsQuery.data,
  ]);

  const isLoading =
    analyticsQuery.isLoading ||
    usersQuery.isLoading ||
    eventsQuery.isLoading ||
    pendingPostsQuery.isLoading ||
    pendingEventsQuery.isLoading ||
    stationsQuery.isLoading ||
    trashReportsQuery.isLoading;

  const isFetching =
    analyticsQuery.isFetching ||
    usersQuery.isFetching ||
    eventsQuery.isFetching ||
    pendingPostsQuery.isFetching ||
    pendingEventsQuery.isFetching ||
    stationsQuery.isFetching ||
    trashReportsQuery.isFetching;

  return {
    analytics: analyticsQuery.data,
    totals,
    monthlyBreakdown: analyticsQuery.data?.monthlyBreakdown ?? [],
    recentUsers: usersQuery.data?.content ?? [],
    recentEvents: eventsQuery.data?.content ?? [],
    isLoading,
    isFetching,
  };
};
