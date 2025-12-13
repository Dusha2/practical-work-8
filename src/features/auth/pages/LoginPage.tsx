import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "../api/auth.api";
import type { JSX } from "react";

// Схема валідації: перевіряємо, чи це email і чи є пароль
const LoginSchema = z.object({
  email: z.string().email("Введіть коректний email"),
  password: z.string().min(4, "Пароль занадто короткий"),
});

type LoginForm = z.infer<typeof LoginSchema>;

export function LoginPage(): JSX.Element {
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "admin@admin1.com", // Твій тестовий логін з бекенду
      password: "password",      // Твій тестовий пароль
    }
  });

  const onSubmit: SubmitHandler<LoginForm> = (data) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Вхід у систему</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              {...register("email")}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="admin@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
            <input 
              type="password"
              {...register("password")}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Помилка сервера (якщо логін невірний) */}
          {loginMutation.isError && (
            <div className="bg-red-50 text-red-600 p-3 rounded text-sm">
              Помилка входу. Перевірте логін або пароль.
            </div>
          )}

          <button 
            type="submit" 
            disabled={loginMutation.isPending}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-70 transition"
          >
            {loginMutation.isPending ? "Входимо..." : "Увійти"}
          </button>
        </form>
      </div>
    </div>
  );
}