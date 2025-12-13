import { Tour } from "./tour.types";

export interface TourDate {
  id: number;
  startDate: string;
  endDate: string;
  numberOfVacancies: number;
  maxNumberOfSeats: number;
  tour?: Tour | null;
}

export interface CreateTourDateDto {
  startDate: string;
  endDate: string;
  numberOfVacancies: number;
  maxNumberOfSeats: number; // Це поле є в базі, тому передаємо його
  tourId: number;
}