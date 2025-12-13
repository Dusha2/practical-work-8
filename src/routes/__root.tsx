import { createRootRoute, Outlet } from "@tanstack/react-router";
import { NavBar } from "@/components/layout/NavBar";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanStackRouterDevelopmentTools } from "@/components/utils/development-tools/TanStackRouterDevelopmentTools";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. Навігація зверху */}
      <NavBar />
      
      {/* 2. Контент сторінки (Login, Tours...) */}
      <div className="flex flex-col">
        <Outlet />
      </div>

      {/* 3. Інструменти розробника (з'являться знизу справа) */}
      <ReactQueryDevtools initialIsOpen={false} />
      <TanStackRouterDevelopmentTools initialIsOpen={false} />
    </div>
  );
}