import { createHashRouter, Outlet } from 'react-router-dom';
import { chatRouter } from './pages/chat/chat.router';
import HomePage from './pages/index/index.page';
import { authRouter } from './pages/auth/auth.router';
import {
  AuthGuardedWrapper,
  PublicGuardedWrapper,
} from './common/components/AuthGuardWrapper';

export const AppRoute = createHashRouter([
  {
    path: '/',
    element: (
      <PublicGuardedWrapper>
        <HomePage />
      </PublicGuardedWrapper>
    ),
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
    element: (
      <PublicGuardedWrapper>
        <Outlet />
      </PublicGuardedWrapper>
    ),
  },
  {
    path: '*',
    element: <p>Not Found</p>,
  },
]);
