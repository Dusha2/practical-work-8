// Enums з бекенду
export enum TourType {
  Recreation = 'Відпочинок',
  Excursion = 'Екскурсія',
  ActiveRecreation = 'Активний відпочинок',
  GastronomicTour = 'Гастрономічний тур',
}

export enum TourStatus {
  Active = 'Активний',
  Inactive = 'Неактивний',
  Archived = 'Архівний',
}

// Основний тип Туру
export interface Tour {
  id: number;
  tourName: string;
  description: string;
  route: string; // 👈 Додано обов'язкове поле
  duration: number;
  baseCost: number;
  tourType: TourType;
  status: TourStatus;
}

// Тип для створення (без ID)
export interface CreateTourDto {
  tourName: string;
  description: string;
  route: string; // 👈 Додано
  duration: number;
  baseCost: number;
  tourType: TourType;
  status?: TourStatus;
}

// Тип для оновлення
export interface UpdateTourDto extends Partial<CreateTourDto> {}