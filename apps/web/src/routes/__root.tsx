import { RegistryProvider } from "@effect/atom-react"
import { createRootRoute, Outlet } from "@tanstack/react-router"

export const Route = createRootRoute({
  component: () => (
    <RegistryProvider>
      <Outlet />
    </RegistryProvider>
  ),
})
