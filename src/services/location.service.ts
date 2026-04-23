import { apiClient } from "lib/apiClient";
import type { Province, Ward } from "types/location.types";

export const locationService = {
  getProvinces: async (): Promise<Province[]> => {
    const { data } = await apiClient.get<Province[]>("/divisions/provinces");
    return data;
  },

  getWardsByProvince: async (provinceCode: number): Promise<Ward[]> => {
    const { data } = await apiClient.get<Ward[]>(
      `/divisions/provinces/${provinceCode}/wards`,
    );
    return data;
  },
};
