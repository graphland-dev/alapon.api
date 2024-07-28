import { RouterProvider } from 'react-router-dom';
import { AppRoute } from './root.router';

function RootApp() {
  return (
    <>
      <RouterProvider router={AppRoute} />
    </>
  );
}

export default RootApp;
