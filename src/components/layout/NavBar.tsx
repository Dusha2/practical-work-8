import { Link, useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/store/useAuthStore"; 

export function NavBar() {
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate({ to: "/login" });
  };

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      {/* ЛІВА ЧАСТИНА: Логотип та посилання */}
      <div className="flex gap-4 items-center">
        <Link to="/" className="font-bold text-xl text-blue-900">MyTravelApp</Link>
        
        {/* Показуємо посилання ТІЛЬКИ якщо користувач увійшов */}
        {isAuthenticated && (
          <>
            <Link 
              to="/tours" 
              className="[&.active]:font-bold [&.active]:text-blue-600 text-gray-600 hover:text-blue-500 transition-colors"
            >
              Тури
            </Link>
            
            {/* Поки коментуємо, бо сторінки ще немає */}
            {/* <Link to="/students">Студенти</Link> */}
          </>
        )}
      </div>

      {/* ПРАВА ЧАСТИНА: Кнопка входу/виходу */}
      <div>
        {isAuthenticated ? (
          <button 
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm transition-colors font-medium"
          >
            Вийти
          </button>
        ) : (
          <Link 
            to="/login" 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm transition-colors font-medium"
          >
            Увійти
          </Link>
        )}
      </div>
    </nav>
  );
}