import { apiClient } from "@/lib/apiClient";
import type {
  RecyclingStation,
  CreateStationRequest,
  UpdateStationRequest,
  UpdateStationStatusRequest,
  StationQueryParams,
  WasteType,
} from "@/types/station.types";
import type { ApiResponse } from "@/types/common.types";

// ── Service ────────────────────────────────────────────────────
export const stationService = {
  async getStations(params?: StationQueryParams): Promise<RecyclingStation[]> {
    const { data } = await apiClient.get<RecyclingStation[]>(
      "/recycling-stations",
      { params },
    );
    return data;
  },

  async getStationById(id: string): Promise<RecyclingStation> {
    const { data } = await apiClient.get<RecyclingStation>(
      `/recycling-stations/${id}`,
    );
    return data;
  },

  async createStation(
    payload: CreateStationRequest,
  ): Promise<RecyclingStation> {
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
    const { data } = await apiClient.patch<RecyclingStation>(
      `/recycling-stations/${id}/status`,
      payload,
    );
    return data;
  },

  async deleteStation(id: string): Promise<void> {
    await apiClient.delete(`/recycling-stations/${id}`);
  },

  // Helper — lấy master list waste types (dùng trong form)
  async getWasteTypes(): Promise<WasteType[]> {
    // Nếu BE có endpoint riêng, thay ở đây
    const { data } = await apiClient.get<WasteType[]>("/waste-types");
    return data;
  },
};
