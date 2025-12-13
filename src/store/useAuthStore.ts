import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  logout: () => void;
}

// Ми використовуємо middleware 'persist', щоб токен зберігався 
// в LocalStorage браузера і не зникав після оновлення сторінки
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,

      setToken: (token: string) => {
        set({ token, isAuthenticated: true });
      },

      logout: () => {
        set({ token: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage", // унікальне ім'я ключа в LocalStorage
    }
  )
);