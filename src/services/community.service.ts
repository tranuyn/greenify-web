import { apiClient } from "@/lib/apiClient";
import type {
  Event,
  EventRegistration,
  RecyclingStation,
  TrashSpotReport,
  CreateTrashReportRequest,
  CreateEventRequest,
  EventApiRequestParams,
  EventQueryParams,
  UpdateEventRequest,
  RejectEventRequest,
  ParticipatedEventQueryParams,
} from "@/types/community.types";
import {
  ApiResponse,
  PageResponse,
  PaginationParams,
} from "@/types/common.types";
import { IS_MOCK_MODE, mockDelay, mockSuccess } from "./mock/config";
import {
  MOCK_EVENTS,
  MOCK_MY_REGISTRATIONS,
  MOCK_STATIONS,
  MOCK_TRASH_REPORTS,
} from "./mock/community.mock";
import { SortOption } from "@/constants/enums/sortOptions.enum";

// ============================================================
// EVENT SERVICE
// ============================================================
export const eventService = {
  async getEvents(params?: EventQueryParams): Promise<PageResponse<Event>> {
    const apiParams = {
      ...params,
      page: params?.page ? params.page - 1 : 0,
      size: params?.size ?? 10,
    };
    // if (IS_MOCK_MODE) {
    //   await mockDelay(500);
    //   return {
    //     content: MOCK_EVENTS,
    //     totalElements: MOCK_EVENTS.length,
    //     page: params?.page ?? 1,
    //     size: params?.size ?? 20,
    //     totalPages: 5,
    //   };
    // }

    const { data } = await apiClient.get<PageResponse<Event>>("/events", {
      params: apiParams,
    });

    return data;
  },

  async getEventById(eventId: string): Promise<Event> {
    // if (IS_MOCK_MODE) {
    //   await mockDelay(400);
    //   const event = MOCK_EVENTS.find((e) => e.id === eventId);
    //   if (!event) throw new Error('Event not found');
    //   return event;
    // }
    const { data } = await apiClient.get<Event>(`/events/${eventId}`);
    return data;
  },

  async registerEvent(
    eventId: string,
  ): Promise<ApiResponse<EventRegistration>> {
    if (IS_MOCK_MODE) {
      await mockDelay(700);
      const event = MOCK_EVENTS.find((e) => e.id === eventId);
      const reg: EventRegistration = {
        id: `reg-${Date.now()}`,
        eventId,
        userId: "usr-001",
        status: "REGISTERED",
        eventTitle: event?.title,
        registrationCode: `QR_${eventId}_USR001_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      return mockSuccess(reg);
    }
    const { data } = await apiClient.post<ApiResponse<EventRegistration>>(
      `/events/${eventId}/register`,
    );
    return data;
  },

  async getMyRegistrations(
    userId: string,
    params?: ParticipatedEventQueryParams,
  ): Promise<PageResponse<Event>> {
    const apiParams = {
      title: params?.title,
      address: params?.address,
      status: params?.status === "all" ? undefined : params?.status,
      page: params?.page ? params.page - 1 : 0,
      size: params?.size ?? 10,
    };

    const { data } = await apiClient.get<PageResponse<Event>>(
      `/events/participated/${userId}`,
      {
        params: apiParams,
      },
    );
    return data;
  },

  async getNgoEvents(
    ngoId: string,
    params?: PaginationParams,
  ): Promise<PageResponse<Event>> {
    // if (IS_MOCK_MODE) {
    //   await mockDelay(600);
    //   return mockSuccess({
    //     content: MOCK_EVENTS,
    //     totalElements: MOCK_EVENTS.length,
    //     page: params?.page ?? 1,
    //     size: params?.size ?? 20,
    //     totalPages: Math.ceil(MOCK_EVENTS.length / (params?.size ?? 20)),
    //   });
    // }
    const apiParams = {
      page: params?.page ? params.page - 1 : 0,
      size: params?.size ?? 10,
    };

    const { data } = await apiClient.get<PageResponse<Event>>(
      `/events/ngo/${ngoId}`,
      {
        params: apiParams,
      },
    );
    return data;
  },

  async createEvent(payload: CreateEventRequest): Promise<Event> {
    // Đảm bảo status này map đúng với Enum của Backend!
    const fixedPayload = {
      ...payload,
      status: payload.status || "APPROVAL_WAITING",
    };

    const { data } = await apiClient.post<Event>("/events", fixedPayload);
    return data;
  },

  async updateEvent(
    eventId: string,
    payload: UpdateEventRequest,
  ): Promise<Event> {
    const { data } = await apiClient.put<Event>(`/events/${eventId}`, payload);

    return data;
  },

  async approveEvent(eventId: string): Promise<void> {
    await apiClient.post(`/events/${eventId}/approve`);
  },

  async rejectEvent(
    eventId: string,
    payload: RejectEventRequest,
  ): Promise<void> {
    await apiClient.post(`/events/${eventId}/reject`, payload);
  },

  async deleteEvent(eventId: string): Promise<null> {
    // if (IS_MOCK_MODE) {
    //   await mockDelay(600);

    //   const eventIndex = MOCK_EVENTS.findIndex((e) => e.id === eventId);
    //   if (eventIndex === -1) throw new Error('Event not found');

    //   MOCK_EVENTS.splice(eventIndex, 1);

    //   return mockSuccess(null);
    // }

    const { data } = await apiClient.delete<null>(`/events/${eventId}`);
    return data;
  },

  async checkInAttendee(
    eventId: string,
    qrToken: string,
  ): Promise<
    ApiResponse<{ registration_id: string; user_name: string; status: string }>
  > {
    if (IS_MOCK_MODE) {
      await mockDelay(500);
      return mockSuccess({
        registration_id: "reg-001",
        user_name: "Nhã Uyên",
        status: "CHECKED_IN",
      });
    }
    const { data } = await apiClient.post(`/ngo/events/${eventId}/check-in`, {
      qr_token: qrToken,
    });
    return data;
  },
};

// ============================================================
// MAP SERVICE
// ============================================================
export const mapService = {
  async getStations(): Promise<ApiResponse<RecyclingStation[]>> {
    if (IS_MOCK_MODE) {
      await mockDelay(500);
      return mockSuccess(MOCK_STATIONS.filter((s) => s.status === "ACTIVE"));
    }
    const { data } =
      await apiClient.get<ApiResponse<RecyclingStation[]>>("/stations");
    return data;
  },
};

// ============================================================
// COMMUNITY / TRASH REPORT SERVICE
// ============================================================
export const trashService = {
  async getReports(
    params?: PaginationParams,
  ): Promise<ApiResponse<PageResponse<TrashSpotReport>>> {
    if (IS_MOCK_MODE) {
      await mockDelay(500);
      return mockSuccess({
        content: MOCK_TRASH_REPORTS,
        totalElements: MOCK_TRASH_REPORTS.length,
        page: params?.page ?? 1,
        size: params?.size ?? 10,
        totalPages: Math.ceil(MOCK_TRASH_REPORTS.length / (params?.size ?? 10)),
      });
    }
    const { data } = await apiClient.get<
      ApiResponse<PageResponse<TrashSpotReport>>
    >("/trash-reports", {
      params: {
        page: params?.page,
        size: params?.size,
      },
    });
    return data;
  },

  async createReport(
    payload: CreateTrashReportRequest,
  ): Promise<ApiResponse<TrashSpotReport>> {
    if (IS_MOCK_MODE) {
      await mockDelay(800);
      const report: TrashSpotReport = {
        id: `trash-${Date.now()}`,
        reporter_id: "usr-001",
        after_media_urls: null,
        verify_count: 0,
        hot_score: 0,
        assigned_ngo_id: null,
        status: "SUBMITTED",
        resolve_note: null,
        resolve_completed_at: null,
        admin_resolve_note: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...payload,
      };
      return mockSuccess(report);
    }
    const { data } = await apiClient.post<ApiResponse<TrashSpotReport>>(
      "/trash-reports",
      payload,
    );
    return data;
  },
};
