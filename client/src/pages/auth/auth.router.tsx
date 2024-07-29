import { RouteObject } from 'react-router-dom';
import LoginPage from './login/login.page';
import JoinPage from './join/join.page';

export const authRouter: RouteObject[] = [
  {
    path: '',
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
