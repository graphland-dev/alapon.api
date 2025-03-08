import { RouterProvider } from '@tanstack/react-router';
import { useAuthState } from './common/states/auth.atom';
import { router } from './main';

const Root = () => {
  const auth = useAuthState();
  return <RouterProvider router={router} context={{ auth }} />;
};

export default Root;
