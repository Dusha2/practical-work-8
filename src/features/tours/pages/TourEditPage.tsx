import { useParams, useNavigate } from "@tanstack/react-router";
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTour, useUpdateTour } from "../api/tour.api";
import { useEffect } from "react";
import type { JSX } from "react";
import { TourType, TourStatus } from "../types/tour.types";
// 👇 Імпортуємо наш новий компонент для дат
import { TourDatesManager } from "../components/TourDatesManager"; 

const TourEditSchema = z.object({
  tourName: z.string().min(1, "Введіть назву туру"),
  description: z.string().min(10, "Опис занадто короткий"),
  route: z.string().min(5, "Вкажіть маршрут"), 
  duration: z.coerce.number().min(1),
  baseCost: z.coerce.number().min(0),
  tourType: z.nativeEnum(TourType),
  status: z.nativeEnum(TourStatus),
});

type TourEditForm = z.infer<typeof TourEditSchema>;

export function TourEditPage(): JSX.Element {
  const { tourId } = useParams({ from: "/tours/$tourId" });
  const navigate = useNavigate();

  const { data: tour, isLoading } = useTour(tourId);
  const updateTourMutation = useUpdateTour();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TourEditForm>({
    resolver: zodResolver(TourEditSchema) as Resolver<TourEditForm>,
  });

  useEffect(() => {
    if (tour) {
      reset({
        tourName: tour.tourName,
        description: tour.description,
        route: tour.route,
        duration: tour.duration,
        baseCost: tour.baseCost,
        tourType: tour.tourType,
        status: tour.status,
      });
    }
  }, [tour, reset]);

  const onSubmit: SubmitHandler<TourEditForm> = async (data) => {
    try {
      await updateTourMutation.mutateAsync({
        id: tourId,
        data: data,
      });
      // Ми НЕ переходимо назад автоматично, щоб користувач міг далі редагувати дати
      alert("Тур оновлено успішно!"); 
    } catch (error) {
      alert("Помилка при оновленні туру");
      console.error(error);
    }
  };

  if (isLoading) return <div className="p-4">Завантаження...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8 pb-20">
      
      {/* --- БЛОК 1: Основна інформація про тур --- */}
      <section>
        <h1 className="text-2xl font-bold mb-4">Редагувати тур #{tourId}</h1>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block font-medium mb-1">Назва</label>
            <input className="border p-2 w-full rounded" {...register("tourName")} />
            {errors.tourName && <p className="text-red-500 text-sm">{errors.tourName.message}</p>}
          </div>

          <div>
            <label className="block font-medium mb-1">Опис</label>
            <textarea className="border p-2 w-full h-24 rounded" {...register("description")} />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>

          {/* Поле Маршрут */}
          <div>
            <label className="block font-medium mb-1">Маршрут</label>
            <textarea className="border p-2 w-full h-16 rounded" {...register("route")} />
            {errors.route && <p className="text-red-500 text-sm">{errors.route.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Тривалість (днів)</label>
              <input type="number" className="border p-2 w-full rounded" {...register("duration")} />
            </div>
            <div>
              <label className="block font-medium mb-1">Ціна (грн)</label>
              <input type="number" className="border p-2 w-full rounded" {...register("baseCost")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Тип</label>
              <select className="border p-2 w-full rounded" {...register("tourType")}>
                {Object.values(TourType).map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Статус</label>
              <select className="border p-2 w-full rounded" {...register("status")}>
                {Object.values(TourStatus).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-4">
             <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled={isSubmitting}>
               Зберегти основні зміни
             </button>
             <button 
               type="button"
               onClick={() => navigate({ to: "/tours" })}
               className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
             >
               Назад до списку
             </button>
          </div>
        </form>
      </section>

      {/* --- БЛОК 2: Управління датами (Вкладений компонент) --- */}
      <section>
        <TourDatesManager tourId={Number(tourId)} />
      </section>

    </div>
  );
}