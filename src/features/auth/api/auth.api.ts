import { useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "@tanstack/react-router";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  data: string; // Тут лежить токен "Bearer eyJ..."
}

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await apiClient.post("/auth/login", payload);
  return response.data;
};

export const useLogin = () => {
  const setToken = useAuthStore((state) => state.setToken);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: login,
    onSuccess: (responseData) => {
      // 👇 2. Беремо токен з поля .data
      console.log("Токен отримано:", responseData.data);
      setToken(responseData.data);
      
      navigate({ to: "/tours" });
    },
    onError: (error) => {
      console.error("Помилка входу:", error);
    }
  });
};