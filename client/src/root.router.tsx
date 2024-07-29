import { createHashRouter, Outlet } from 'react-router-dom';
import { chatRouter } from './pages/chat/chat.router';
import HomePage from './pages/index/index.page';
import { authRouter } from './pages/auth/auth.router';
import { AuthGuardedWrapper } from './common/components/AuthGuardWrapper';

export const AppRoute = createHashRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/chat',
    children: chatRouter,
    element: (
      <AuthGuardedWrapper>
        <Outlet />
      </AuthGuardedWrapper>
    ),
  },
  {
    path: '/auth',
    children: authRouter,
  },
  {
    path: '*',
    element: <p>Not Found</p>,
  },
]);
