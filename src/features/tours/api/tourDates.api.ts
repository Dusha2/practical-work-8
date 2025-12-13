import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import type { TourDate, CreateTourDateDto } from "../types/tourDate.types";

// --- API Functions ---

export const getTourDates = async (): Promise<Array<TourDate>> => {
  const response = await apiClient.get("/tour-dates");
  return response.data as Array<TourDate>;
};

export const createTourDate = async (payload: CreateTourDateDto): Promise<TourDate> => {
  const response = await apiClient.post("/tour-dates", payload);
  return response.data as TourDate;
};

export const deleteTourDate = async (id: number): Promise<void> => {
  await apiClient.delete(`/tour-dates/${id}`);
};

// --- Hooks ---

export const useTourDates = (): UseQueryResult<Array<TourDate>> =>
  useQuery({
    queryKey: ["tour-dates"],
    queryFn: getTourDates,
  });

export const useCreateTourDate = (): UseMutationResult<TourDate, unknown, CreateTourDateDto> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTourDate,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["tour-dates"] });
    },
  });
};

export const useDeleteTourDate = (): UseMutationResult<void, unknown, number> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTourDate,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["tour-dates"] });
    },
  });
};