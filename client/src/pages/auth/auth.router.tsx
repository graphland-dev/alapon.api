import { RouteObject } from 'react-router-dom';
import JoinPage from './join/join.page';
import AuthLayout from './auth.layout';
import LoginPage from './login/login.page';

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
    ],
  },
];
