import { RouteObject } from 'react-router-dom';
import LoginPage from './login/login.page';
import JoinPage from './join/join.page';
import AuthLayout from './auth.layout';

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
