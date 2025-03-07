import ResetPinForm from '@/common/components/forms/ResetPinForm';
import { Paper } from '@mantine/core';
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/auth/reset-pin')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto">
      <Paper withBorder p={'lg'}>
        <ResetPinForm
          onComplete={() => {
            setTimeout(() => {
              navigate({ to: '/auth/login' });
            }, 3000);
          }}
        />
      </Paper>
    </div>
  );
}
