import RootProvider from '@/RootProvider';
import { createRootRoute, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: () => (
    <RootProvider>
      <Outlet />
    </RootProvider>
  ),
});
