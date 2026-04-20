import { useQuery } from "@tanstack/react-query";
import { stationService } from "@/services/station.service";
import { QUERY_KEYS } from "@/constants/queryKeys";
import type { StationQueryParams } from "@/types/station.types";

export const useStations = (params?: StationQueryParams) =>
  useQuery({
    queryKey: QUERY_KEYS.stations.list(params),
    queryFn: () => stationService.getStations(params),
    staleTime: 5 * 60 * 1000,
  });

export const useStationDetail = (id: string) =>
  useQuery({
    queryKey: QUERY_KEYS.stations.detail(id),
    queryFn: () => stationService.getStationById(id),
    enabled: !!id,
  });

export const useWasteTypes = () =>
  useQuery({
    queryKey: QUERY_KEYS.stations.wasteTypes(),
    queryFn: () => stationService.getWasteTypes(),
    staleTime: 30 * 60 * 1000, // master data
  });
