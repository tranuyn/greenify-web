// ============================================================
// RECYCLING STATION TYPES
// ============================================================
export const STATION_STATUS = {
  DRAFT: "DRAFT",
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  TEMPORARY_CLOSED: "TEMPORARY_CLOSED",
} as const;

// Tự động suy luận ra type: "DRAFT" | "ACTIVE" | "INACTIVE" | "TEMPORARY_CLOSED"
export type StationStatus =
  (typeof STATION_STATUS)[keyof typeof STATION_STATUS];

export const ADMIN_STATION_STATUS_FILTER = {
  ALL: "ALL",
  ...STATION_STATUS,
} as const;

export type AdminStationStatus =
  (typeof ADMIN_STATION_STATUS_FILTER)[keyof typeof ADMIN_STATION_STATUS_FILTER];

// render ra các nút lọc trên UI cho đúng thứ tự mong muốn
export const ADMIN_STATION_STATUS_FILTERS: readonly AdminStationStatus[] = [
  ADMIN_STATION_STATUS_FILTER.ALL,
  ADMIN_STATION_STATUS_FILTER.ACTIVE,
  ADMIN_STATION_STATUS_FILTER.INACTIVE,
  ADMIN_STATION_STATUS_FILTER.DRAFT,
  ADMIN_STATION_STATUS_FILTER.TEMPORARY_CLOSED,
];

export const DAY_OF_WEEK = {
  MONDAY: "MONDAY",
  TUESDAY: "TUESDAY",
  WEDNESDAY: "WEDNESDAY",
  THURSDAY: "THURSDAY",
  FRIDAY: "FRIDAY",
  SATURDAY: "SATURDAY",
  SUNDAY: "SUNDAY",
} as const;

export type DayOfWeek = (typeof DAY_OF_WEEK)[keyof typeof DAY_OF_WEEK];

export interface WasteType {
  id: string;
  name: string;
  description: string;
}

export interface StationOpenTime {
  id?: string; // có khi GET, không cần khi POST/PUT
  startTime: string; // "HH:mm:ss"
  endTime: string;
  dayOfWeek: DayOfWeek;
}

// Tận dụng lại EventAddress shape — BE dùng cùng cấu trúc
export interface StationAddress {
  id?: string;
  province: string;
  ward: string;
  addressDetail: string;
  latitude: number;
  longitude: number;
}

// ---- Entity (response từ BE) ----
export interface RecyclingStation {
  id: string;
  name: string;
  description: string;
  phoneNumber: string;
  email: string;
  status: StationStatus;
  address: StationAddress;
  wasteTypes: WasteType[];
  openTimes: StationOpenTime[];
}

// ---- Request bodies ----
export interface CreateStationRequest {
  name: string;
  description: string;
  phoneNumber: string;
  email: string;
  address: Omit<StationAddress, "id">;
  wasteTypeIds: string[]; // gửi IDs, nhận về objects
  openTimes: Omit<StationOpenTime, "id">[];
}

export type UpdateStationRequest = CreateStationRequest;

export interface UpdateStationStatusRequest {
  status: StationStatus;
}

// Query params cho GET /recycling-stations
export interface StationQueryParams {
  wasteTypeId?: string;
}
