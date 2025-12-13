import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import type { Tour, CreateTourDto, UpdateTourDto } from "../types/tour.types";

export const getTours = async (): Promise<Array<Tour>> => {
  const response = await apiClient.get("/tours");
  return response.data as Array<Tour>;
};

export const getTourById = async (id: string): Promise<Tour> => {
  const response = await apiClient.get(`/tours/${id}`);
  return response.data as Tour;
};

export const createTour = async (payload: CreateTourDto): Promise<Tour> => {
  const response = await apiClient.post("/tours", payload);
  return response.data as Tour;
};

export const updateTour = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateTourDto;
}): Promise<Tour> => {
  const response = await apiClient.patch(`/tours/${id}`, data);
  return response.data as Tour;
};

export const deleteTour = async (id: string): Promise<void> => {
  await apiClient.delete(`/tours/${id}`);
};

export const useTours = (): UseQueryResult<Array<Tour>> =>
  useQuery({
    queryKey: ["tours"], // Унікальний ключ для кешування
    queryFn: getTours,
  });

export const useTour = (id: string): UseQueryResult<Tour> =>
  useQuery({
    queryKey: ["tours", id],
    queryFn: () => getTourById(id),
    enabled: Boolean(id), // Запит піде тільки якщо є ID
  });

export const useCreateTour = (): UseMutationResult<Tour, unknown, CreateTourDto> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTour,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["tours"] });
    },
  });
};

export const useUpdateTour = (): UseMutationResult<
  Tour,
  unknown,
  { id: string; data: UpdateTourDto }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTour,
    onSuccess: (updated) => {
      void queryClient.invalidateQueries({ queryKey: ["tours"] });
      void queryClient.setQueryData(["tours", String(updated.id)], updated);
    },
  });
};

export const useDeleteTour = (): UseMutationResult<void, unknown, string> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTour,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["tours"] });
    },
  });
};