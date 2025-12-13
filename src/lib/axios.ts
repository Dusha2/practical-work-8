import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

const apiClient = axios.create({
  baseURL: String(import.meta.env["VITE_API_BASE_URL"]),
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. Request Interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = token;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor (без змін)
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const axiosError = error as AxiosError<{ message?: string }>;
    
    if (axiosError.response?.status === 401) {
      useAuthStore.getState().logout();
    }

    const status = axiosError.response?.status;
    const message =
      axiosError.response?.data?.message ??
      axiosError.message ??
      "Unknown API error";

    console.error("API ERROR:", { status, message });

    return Promise.reject(axiosError);
  }
);

export default apiClient;