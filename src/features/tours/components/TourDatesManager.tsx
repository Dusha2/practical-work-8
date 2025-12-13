import { useForm } from "react-hook-form";
import { useTourDates, useCreateTourDate, useDeleteTourDate } from "../api/tourDates.api";
import { type CreateTourDateDto } from "../types/tourDate.types";

interface Props {
  tourId: number;
}

export function TourDatesManager({ tourId }: Props) {
  // Завантажуємо дати
  const { data: allDates, isLoading } = useTourDates();
  
  // Фільтруємо: показуємо тільки дати для ЦЬОГО туру
  // Використовуємо String(), щоб точно порівняти "2" і 2
  const dates = allDates?.filter((d) => String(d.tour?.id) === String(tourId)) || [];

  const createMutation = useCreateTourDate();
  const deleteMutation = useDeleteTourDate();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateTourDateDto>();

  const onSubmit = async (data: CreateTourDateDto) => {
    try {
      console.log("Відправляємо нову дату:", { ...data, tourId });
      
      await createMutation.mutateAsync({
        ...data,
        tourId: tourId,
      });
      
      reset(); // Очищуємо форму після успіху
    } catch (error: any) {
      console.error("Помилка створення:", error);
      const message = error?.response?.data?.message || "Помилка сервера";
      const details = JSON.stringify(error?.response?.data?.errors || {});
      alert(`Не вдалося створити дату: ${message}\n${details}`);
    }
  };

  if (isLoading) return <div className="p-4 text-gray-500">Завантаження дат...</div>;

  return (
    <div className="mt-8 border-t pt-6">
      <h2 className="text-xl font-bold mb-4">Доступні дати виїздів</h2>

      {/* --- Форма додавання дати --- */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50 p-4 rounded mb-6 border shadow-sm">
        <h3 className="font-semibold mb-3 text-gray-700">➕ Додати нову дату</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          
          <div>
            <label className="text-xs font-medium block mb-1">Дата початку</label>
            <input 
              type="date" 
              {...register("startDate", { required: true })} 
              className="border p-2 w-full text-sm rounded focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>

          <div>
            <label className="text-xs font-medium block mb-1">Дата кінця</label>
            <input 
              type="date" 
              {...register("endDate", { required: true })} 
              className="border p-2 w-full text-sm rounded focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>

          <div>
            <label className="text-xs font-medium block mb-1">Вільних місць</label>
            <input 
              type="number" 
              {...register("numberOfVacancies", { required: true, valueAsNumber: true })} 
              className="border p-2 w-full text-sm rounded focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="20" 
            />
          </div>

          <div>
            <label className="text-xs font-medium block mb-1">Всього місць</label>
            <input 
              type="number" 
              {...register("maxNumberOfSeats", { required: true, valueAsNumber: true })} 
              className="border p-2 w-full text-sm rounded focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="50" 
            />
          </div>

          <button 
            type="submit" 
            disabled={createMutation.isPending}
            className="bg-blue-600 text-white p-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors h-[38px]"
          >
            {createMutation.isPending ? "..." : "Додати"}
          </button>
        </div>
        {Object.keys(errors).length > 0 && <p className="text-red-500 text-xs mt-2">Будь ласка, заповніть всі поля коректно!</p>}
      </form>

      {/* --- Таблиця --- */}
      <div className="overflow-hidden rounded border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left font-semibold">Початок</th>
              <th className="p-3 text-left font-semibold">Кінець</th>
              <th className="p-3 text-left font-semibold">Місця (Вільні/Всього)</th>
              <th className="p-3 text-left font-semibold">Дії</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {dates.map((date) => (
              <tr key={date.id} className="hover:bg-gray-50">
                <td className="p-3 text-gray-900">{date.startDate.split("T")[0]}</td>
                <td className="p-3 text-gray-900">{date.endDate.split("T")[0]}</td>
                <td className="p-3 text-gray-900">
                  <span className="font-medium text-green-600">{date.numberOfVacancies}</span>
                  <span className="text-gray-400"> / </span>
                  <span className="text-gray-600">{date.maxNumberOfSeats}</span>
                </td>
                <td className="p-3">
                  <button 
                    onClick={() => {
                      if(confirm("Видалити цю дату?")) deleteMutation.mutate(date.id)
                    }}
                    className="text-red-600 hover:text-red-800 font-medium transition-colors"
                  >
                    Видалити
                  </button>
                </td>
              </tr>
            ))}
            {dates.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  Для цього туру ще немає дат виїздів.
                  <br/>
                  Скористайтеся формою вище, щоб додати першу!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}