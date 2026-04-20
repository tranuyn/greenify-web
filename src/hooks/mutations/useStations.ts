import { useMutation, useQueryClient } from "@tanstack/react-query";
import { stationService } from "@/services/station.service";
import { QUERY_KEYS } from "@/constants/queryKeys";
import type {
  CreateStationRequest,
  UpdateStationRequest,
  UpdateStationStatusRequest,
} from "@/types/station.types";

export const useCreateStation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateStationRequest) =>
      stationService.createStation(payload),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: QUERY_KEYS.stations.all }),
  });
};

export const useUpdateStation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateStationRequest;
    }) => stationService.updateStation(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.stations.detail(id) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.stations.all });
    },
  });
};

export const useUpdateStationStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateStationStatusRequest;
    }) => stationService.updateStationStatus(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.stations.detail(id) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.stations.all });
    },
  });
};

export const useDeleteStation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => stationService.deleteStation(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: QUERY_KEYS.stations.all }),
  });
};
