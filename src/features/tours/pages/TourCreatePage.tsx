import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { z } from "zod";
import { useCreateTour } from "../api/tour.api";
import { useNavigate } from "@tanstack/react-router";
import type { JSX } from "react";
import { TourType, TourStatus } from "../types/tour.types";

// Схема валідації
const TourCreateSchema = z.object({
  tourName: z.string().min(1, "Введіть назву туру"),
  description: z.string().min(10, "Опис має бути мінімум 10 символів"),
  route: z.string().min(5, "Вкажіть маршрут (мінімум 5 символів)"), 
  duration: z.coerce.number().min(1, "Тривалість має бути хоча б 1 день"),
  baseCost: z.coerce.number().min(0, "Ціна не може бути від'ємною"),
  tourType: z.nativeEnum(TourType),
});

type TourCreateForm = z.infer<typeof TourCreateSchema>;

export function TourCreatePage(): JSX.Element {
  const navigate = useNavigate();
  const createTourMutation = useCreateTour();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TourCreateForm>({
    resolver: zodResolver(TourCreateSchema) as Resolver<TourCreateForm>,
    defaultValues: {
      tourType: TourType.Recreation,
    }
  });

  const onSubmit: SubmitHandler<TourCreateForm> = async (data) => {
    try {
      await createTourMutation.mutateAsync({
        ...data,
        status: TourStatus.Active 
      });
      
      alert("Тур успішно створено!");
      void navigate({ to: "/tours" });
      
    } catch (error: any) {
      console.error("Помилка:", error);
      const serverMessage = error?.response?.data?.message || "Невідома помилка";
      const errorMessage = error?.response?.data?.errorMessage || "";
      alert(`Помилка сервера: ${serverMessage}\n${errorMessage}`);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Створити новий тур</h1>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {/* Назва */}
        <div>
          <label className="block font-medium mb-1">Назва туру</label>
          <input className="border p-2 w-full rounded" {...register("tourName")} />
          {errors.tourName && <p className="text-red-500 text-sm">{errors.tourName.message}</p>}
        </div>

        {/* Опис */}
        <div>
          <label className="block font-medium mb-1">Опис</label>
          <textarea className="border p-2 w-full rounded h-24" {...register("description")} />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>

        {/* Маршрут (НОВЕ ПОЛЕ) */}
        <div>
          <label className="block font-medium mb-1">Маршрут</label>
          <textarea 
            className="border p-2 w-full rounded h-16" 
            placeholder="Наприклад: Київ - Львів - Карпати"
            {...register("route")} 
          />
          {errors.route && <p className="text-red-500 text-sm">{errors.route.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Тривалість */}
          <div>
            <label className="block font-medium mb-1">Тривалість (днів)</label>
            <input type="number" className="border p-2 w-full rounded" {...register("duration")} />
            {errors.duration && <p className="text-red-500 text-sm">{errors.duration.message}</p>}
          </div>

          {/* Ціна */}
          <div>
            <label className="block font-medium mb-1">Ціна (грн)</label>
            <input type="number" className="border p-2 w-full rounded" {...register("baseCost")} />
            {errors.baseCost && <p className="text-red-500 text-sm">{errors.baseCost.message}</p>}
          </div>
        </div>

        {/* Тип туру */}
        <div>
          <label className="block font-medium mb-1">Тип туру</label>
          <select className="border p-2 w-full rounded" {...register("tourType")}>
            {Object.values(TourType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.tourType && <p className="text-red-500 text-sm">{errors.tourType.message}</p>}
        </div>

        <button
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Збереження..." : "Створити тур"}
        </button>
      </form>
    </div>
  );
}