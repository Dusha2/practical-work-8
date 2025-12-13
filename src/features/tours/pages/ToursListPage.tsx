import { Link } from "@tanstack/react-router";
import { useTours, useDeleteTour } from "../api/tour.api";
import type { JSX } from "react";

export function ToursListPage(): JSX.Element {
  // Використовуємо наш хук для отримання даних
  const { data: tours, isLoading, isError, error } = useTours();
  
  // Хук для видалення
  const deleteMutation = useDeleteTour();

  if (isLoading) {
    return <div className="p-4">Завантаження турів...</div>;
  }

  if (isError) {
    return (
      <div className="p-4 text-red-500">
        Помилка: {error?.message ?? "Невідома помилка"}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Список турів</h1>

        {/* Кнопка веде на сторінку створення (її ми зробимо наступною) */}
        <Link
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          to="/tours/new"
        >
          ➕ Додати тур
        </Link>
      </div>

      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2">ID</th>
            <th className="border px-3 py-2">Назва</th>
            <th className="border px-3 py-2">Тип</th>
            <th className="border px-3 py-2">Ціна</th>
            <th className="border px-3 py-2">Тривалість</th>
            <th className="border px-3 py-2">Статус</th>
            <th className="border px-3 py-2">Дії</th>
          </tr>
        </thead>

        <tbody>
          {tours?.map((tour) => (
            <tr key={tour.id} className="border-t hover:bg-gray-50">
              <td className="border px-3 py-2">{tour.id}</td>
              <td className="border px-3 py-2 font-medium">{tour.tourName}</td>
              <td className="border px-3 py-2">{tour.tourType}</td>
              <td className="border px-3 py-2">{tour.baseCost} грн</td>
              <td className="border px-3 py-2">{tour.duration} днів</td>
              
              {/* Статус з кольоровим індикатором */}
              <td className="border px-3 py-2">
                <span className={`px-2 py-1 rounded text-sm ${
                  tour.status === 'Активний' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {tour.status}
                </span>
              </td>

              <td className="border px-3 py-2 space-x-3">
                {/* Кнопка редагування */}
                <Link
                  className="text-blue-600 hover:underline"
                  to="/tours/$tourId"
                  params={{ tourId: String(tour.id) }}
                >
                  ✏ Редагувати
                </Link>

                {/* Кнопка видалення */}
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => {
                    if (confirm('Ви точно хочете видалити цей тур?')) {
                      deleteMutation.mutate(String(tour.id));
                    }
                  }}
                >
                  🗑 Видалити
                </button>
              </td>
            </tr>
          ))}

          {tours?.length === 0 && (
            <tr>
              <td className="py-4 text-center text-gray-500" colSpan={7}>
                Турів поки що немає
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}