import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Admin from "./pages/Admin";
import AdminReset from "./pages/AdminReset";
import Home from "./pages/Home";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Toaster />
      <Outlet />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: Admin,
});
const adminResetRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin-reset",
  component: AdminReset,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  adminRoute,
  adminResetRoute,
]);
const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
