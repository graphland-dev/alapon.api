import { createLazyFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/auth')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="mx-auto my-10">
      <Outlet />
    </div>
  );
}
