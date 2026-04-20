import { apiClient } from "@/lib/apiClient";
import type {
  RecyclingStation,
  CreateStationRequest,
  UpdateStationRequest,
  UpdateStationStatusRequest,
  StationQueryParams,
  WasteType,
} from "@/types/station.types";
import { IS_MOCK_MODE, mockDelay, mockSuccess } from "./mock/config";
import type { ApiResponse } from "@/types/common.types";

// ── Mock data ──────────────────────────────────────────────────
export const MOCK_STATIONS: RecyclingStation[] = [
  {
    id: "sta-001",
    name: "Điểm thu gom Co.opmart Nguyễn Đình Chiểu",
    description: "Thùng thu gom đặt tại khu vực bãi giữ xe tầng B1.",
    phoneNumber: "028 3930 5678",
    email: "coopmartq3@coopmart.vn",
    status: "ACTIVE",
    address: {
      id: "addr-001",
      province: "TP. Hồ Chí Minh",
      ward: "Phường 6",
      addressDetail: "168 Nguyễn Đình Chiểu",
      latitude: 10.7849,
      longitude: 106.6903,
    },
    wasteTypes: [
      { id: "wt-001", name: "Giấy", description: "Giấy báo, thùng carton..." },
      { id: "wt-002", name: "Nhựa", description: "Chai PET, hộp nhựa..." },
      {
        id: "wt-003",
        name: "Lon kim loại",
        description: "Lon nước ngọt, lon bia...",
      },
    ],
    openTimes: [
      {
        id: "ot-001",
        startTime: "08:00:00",
        endTime: "21:00:00",
        dayOfWeek: "MONDAY",
      },
      {
        id: "ot-002",
        startTime: "08:00:00",
        endTime: "21:00:00",
        dayOfWeek: "TUESDAY",
      },
      {
        id: "ot-003",
        startTime: "08:00:00",
        endTime: "21:00:00",
        dayOfWeek: "WEDNESDAY",
      },
      {
        id: "ot-004",
        startTime: "08:00:00",
        endTime: "21:00:00",
        dayOfWeek: "THURSDAY",
      },
      {
        id: "ot-005",
        startTime: "08:00:00",
        endTime: "21:00:00",
        dayOfWeek: "FRIDAY",
      },
      {
        id: "ot-006",
        startTime: "08:00:00",
        endTime: "21:30:00",
        dayOfWeek: "SATURDAY",
      },
      {
        id: "ot-007",
        startTime: "09:00:00",
        endTime: "21:00:00",
        dayOfWeek: "SUNDAY",
      },
    ],
  },
  {
    id: "sta-002",
    name: "Trạm tái chế mGreen – Võ Văn Tần",
    description: "Nhận pin và thiết bị điện tử cũ miễn phí.",
    phoneNumber: "0901 234 567",
    email: "mgreen.vvt@mgreen.vn",
    status: "ACTIVE",
    address: {
      id: "addr-002",
      province: "TP. Hồ Chí Minh",
      ward: "Phường 5",
      addressDetail: "42 Võ Văn Tần",
      latitude: 10.7801,
      longitude: 106.6872,
    },
    wasteTypes: [
      { id: "wt-001", name: "Giấy", description: "" },
      { id: "wt-002", name: "Nhựa", description: "" },
      { id: "wt-004", name: "Pin", description: "Pin AA, AAA, lithium..." },
      {
        id: "wt-005",
        name: "Điện tử",
        description: "Điện thoại, laptop cũ...",
      },
    ],
    openTimes: [
      {
        id: "ot-008",
        startTime: "07:30:00",
        endTime: "17:30:00",
        dayOfWeek: "MONDAY",
      },
      {
        id: "ot-009",
        startTime: "07:30:00",
        endTime: "17:30:00",
        dayOfWeek: "TUESDAY",
      },
      {
        id: "ot-010",
        startTime: "07:30:00",
        endTime: "17:30:00",
        dayOfWeek: "WEDNESDAY",
      },
      {
        id: "ot-011",
        startTime: "07:30:00",
        endTime: "17:30:00",
        dayOfWeek: "THURSDAY",
      },
      {
        id: "ot-012",
        startTime: "07:30:00",
        endTime: "17:30:00",
        dayOfWeek: "FRIDAY",
      },
      {
        id: "ot-013",
        startTime: "08:00:00",
        endTime: "12:00:00",
        dayOfWeek: "SATURDAY",
      },
    ],
  },
  {
    id: "sta-003",
    name: "Điểm thu gom UBND Phường Bến Nghé",
    description: "Chỉ thu gom Thứ 3, Thứ 5 và Thứ 7 sáng sớm.",
    phoneNumber: "028 3829 0000",
    email: "bennghe@hcmc.gov.vn",
    status: "TEMPORARY_CLOSED",
    address: {
      id: "addr-003",
      province: "TP. Hồ Chí Minh",
      ward: "Phường Bến Nghé",
      addressDetail: "5 Pasteur",
      latitude: 10.7769,
      longitude: 106.7024,
    },
    wasteTypes: [
      { id: "wt-006", name: "Rác hữu cơ", description: "" },
      { id: "wt-001", name: "Giấy", description: "" },
      { id: "wt-002", name: "Nhựa", description: "" },
    ],
    openTimes: [
      {
        id: "ot-014",
        startTime: "06:00:00",
        endTime: "08:00:00",
        dayOfWeek: "TUESDAY",
      },
      {
        id: "ot-015",
        startTime: "06:00:00",
        endTime: "08:00:00",
        dayOfWeek: "THURSDAY",
      },
      {
        id: "ot-016",
        startTime: "06:00:00",
        endTime: "09:00:00",
        dayOfWeek: "SATURDAY",
      },
    ],
  },
];

// Master waste types — dùng cho form checkbox
export const MOCK_WASTE_TYPES: WasteType[] = [
  {
    id: "wt-001",
    name: "Giấy",
    description: "Giấy báo, thùng carton, sách cũ",
  },
  {
    id: "wt-002",
    name: "Nhựa",
    description: "Chai PET, hộp nhựa, túi nilon cứng",
  },
  {
    id: "wt-003",
    name: "Lon kim loại",
    description: "Lon nước ngọt, lon bia, hộp thiếc",
  },
  { id: "wt-004", name: "Pin", description: "Pin AA, AAA, lithium, pin xe" },
  {
    id: "wt-005",
    name: "Điện tử",
    description: "Điện thoại, laptop, thiết bị cũ",
  },
  {
    id: "wt-006",
    name: "Rác hữu cơ",
    description: "Thức ăn thừa, vỏ trái cây",
  },
  {
    id: "wt-007",
    name: "Thủy tinh",
    description: "Chai thủy tinh, lọ thủy tinh",
  },
];

// ── Service ────────────────────────────────────────────────────
export const stationService = {
  async getStations(params?: StationQueryParams): Promise<RecyclingStation[]> {
    if (IS_MOCK_MODE) {
      await mockDelay(500);
      let result = [...MOCK_STATIONS];
      if (params?.wasteTypeId) {
        result = result.filter((s) =>
          s.wasteTypes.some((w) => w.id === params.wasteTypeId),
        );
      }
      return result;
    }
    const { data } = await apiClient.get<RecyclingStation[]>(
      "/recycling-stations",
      { params },
    );
    return data;
  },

  async getStationById(id: string): Promise<RecyclingStation> {
    if (IS_MOCK_MODE) {
      await mockDelay(300);
      const station = MOCK_STATIONS.find((s) => s.id === id);
      if (!station) throw new Error("Station not found");
      return station;
    }
    const { data } = await apiClient.get<RecyclingStation>(
      `/recycling-stations/${id}`,
    );
    return data;
  },

  async createStation(
    payload: CreateStationRequest,
  ): Promise<RecyclingStation> {
    if (IS_MOCK_MODE) {
      await mockDelay(700);
      const wasteTypes = MOCK_WASTE_TYPES.filter((w) =>
        payload.wasteTypeIds.includes(w.id),
      );
      const newStation: RecyclingStation = {
        id: `sta-${Date.now()}`,
        name: payload.name,
        description: payload.description,
        phoneNumber: payload.phoneNumber,
        email: payload.email,
        status: "DRAFT",
        address: { id: `addr-${Date.now()}`, ...payload.address },
        wasteTypes,
        openTimes: payload.openTimes.map((ot, i) => ({
          id: `ot-new-${i}`,
          ...ot,
        })),
      };
      MOCK_STATIONS.unshift(newStation);
      return newStation;
    }
    const { data } = await apiClient.post<RecyclingStation>(
      "/recycling-stations",
      payload,
    );
    return data;
  },

  async updateStation(
    id: string,
    payload: UpdateStationRequest,
  ): Promise<RecyclingStation> {
    if (IS_MOCK_MODE) {
      await mockDelay(600);
      const idx = MOCK_STATIONS.findIndex((s) => s.id === id);
      if (idx === -1) throw new Error("Station not found");
      const wasteTypes = MOCK_WASTE_TYPES.filter((w) =>
        payload.wasteTypeIds.includes(w.id),
      );
      const updated: RecyclingStation = {
        ...MOCK_STATIONS[idx],
        ...payload,
        address: { ...MOCK_STATIONS[idx].address, ...payload.address },
        wasteTypes,
        openTimes: payload.openTimes.map((ot, i) => ({
          id: `ot-upd-${i}`,
          ...ot,
        })),
      };
      MOCK_STATIONS[idx] = updated;
      return updated;
    }
    const { data } = await apiClient.put<RecyclingStation>(
      `/recycling-stations/${id}`,
      payload,
    );
    return data;
  },

  async updateStationStatus(
    id: string,
    payload: UpdateStationStatusRequest,
  ): Promise<RecyclingStation> {
    if (IS_MOCK_MODE) {
      await mockDelay(400);
      const idx = MOCK_STATIONS.findIndex((s) => s.id === id);
      if (idx === -1) throw new Error("Station not found");
      MOCK_STATIONS[idx].status = payload.status;
      return MOCK_STATIONS[idx];
    }
    const { data } = await apiClient.patch<RecyclingStation>(
      `/recycling-stations/${id}/status`,
      payload,
    );
    return data;
  },

  async deleteStation(id: string): Promise<void> {
    if (IS_MOCK_MODE) {
      await mockDelay(500);
      const idx = MOCK_STATIONS.findIndex((s) => s.id === id);
      if (idx !== -1) MOCK_STATIONS.splice(idx, 1);
      return;
    }
    await apiClient.delete(`/recycling-stations/${id}`);
  },

  // Helper — lấy master list waste types (dùng trong form)
  async getWasteTypes(): Promise<WasteType[]> {
    if (IS_MOCK_MODE) {
      await mockDelay(200);
      return MOCK_WASTE_TYPES;
    }
    // Nếu BE có endpoint riêng, thay ở đây
    const { data } = await apiClient.get<WasteType[]>("/waste-types");
    return data;
  },
};
