import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { eventService } from "@/services/community.service";
import { PaginationParams } from "@/types/common.types";
import {
  EventQueryParams,
  EventStatus,
  ParticipatedEventQueryParams,
} from "@/types/community.types";

export const useEvents = (params?: EventQueryParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.events.list(params),
    queryFn: () => eventService.getEvents(params),
  });
};

export const useEventsByStatuses = (
  statuses: EventStatus[],
  params?: Omit<EventQueryParams, "statuses">,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.events.list({ ...params, statuses }),
    queryFn: () => eventService.getEvents({ ...params, statuses }),
  });
};

export const usePublishedEvents = (
  params?: Omit<EventQueryParams, "statuses">,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.events.list({ ...params, statuses: ["PUBLISHED"] }),
    queryFn: () => eventService.getEvents({ ...params, statuses: ["PUBLISHED"] }),
  });
};

export const usePendingApprovalEvents = (
  params?: Omit<EventQueryParams, "statuses">,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.events.list({
      ...params,
      statuses: ["PENDING_APPROVAL"],
    }),
    queryFn: () =>
      eventService.getEvents({ ...params, statuses: ["PENDING_APPROVAL"] }),
  });
};

export const useEventDetail = (eventId?: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.events.detail(eventId ?? ""),
    queryFn: () => eventService.getEventById(eventId ?? ""),
    enabled: !!eventId,
  });
};

export const useMyRegistrations = (
  userId?: string,
  params?: ParticipatedEventQueryParams,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.events.myRegistrations(userId, params),
    queryFn: () => eventService.getMyRegistrations(userId ?? "", params),
    enabled: !!userId,
  });
};

export const useNgoEvents = (ngoId?: string, params?: PaginationParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.events.ngoList({ ngoId, ...params }),
    queryFn: () => eventService.getNgoEvents(ngoId ?? "", params),
    enabled: !!ngoId,
  });
};