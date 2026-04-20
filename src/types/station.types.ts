// ============================================================
// RECYCLING STATION TYPES
// ============================================================

export type StationStatus =
  | "DRAFT"
  | "ACTIVE"
  | "INACTIVE"
  | "TEMPORARY_CLOSED";

export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

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
