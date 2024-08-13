import { RouteObject } from 'react-router-dom';
import JoinPage from './join/join.page';
import AuthLayout from './auth.layout';
import LoginPage from './login/login.page';
import ResetPinPage from './reset-pin/reset-pin.page';

export const authRouter: RouteObject[] = [
  {
    path: '',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'join',
        element: <JoinPage />,
      },
      {
        path: 'reset-pin',
        element: <ResetPinPage />,
      },
    ],
  },
];
