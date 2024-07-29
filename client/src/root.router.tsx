import { createHashRouter } from 'react-router-dom';
import { chatRouter } from './pages/chat/chat.router';
import HomePage from './pages/index/index.page';

export const AppRoute = createHashRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/chat',
    children: chatRouter,
    // element: <div>Room</div>,
    // element: (
    //   <AuthGuardedWrapper>
    //     <TenantRouterResolverWrapper>
    //       <Outlet />
    //     </TenantRouterResolverWrapper>
    //   </AuthGuardedWrapper>
    // ),
  },
  {
    path: '*',
    element: <p>Not Found</p>,
  },
]);
