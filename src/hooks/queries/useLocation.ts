import { useQuery } from "@tanstack/react-query";
import { locationService } from "@/services/location.service";
import { QUERY_KEYS } from "@/constants/queryKeys";

export const useProvinces = () => {
  return useQuery({
    queryKey: QUERY_KEYS.divisions.provinces,
    queryFn: () => locationService.getProvinces(),
    staleTime: 1000 * 60 * 60 * 24, // 24 giờ
  });
};

export const useWards = (provinceCode?: number | null) => {
  return useQuery({
    queryKey: provinceCode ? QUERY_KEYS.divisions.wards(provinceCode) : ["divisions", "wards", "none"],
    queryFn: () => locationService.getWardsByProvince(provinceCode!),
    enabled: !!provinceCode, 
    staleTime: 1000 * 60 * 60 * 24, // 24 giờ
  });
};