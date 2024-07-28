import { createHashRouter, Link } from 'react-router-dom';
import { chatRouter } from './pages/chat/chat.router';

export const AppRoute = createHashRouter([
  {
    path: '/',
    element: (
      <div>
        <Link to="/chat/1">Chat 1</Link>
        <Link to="/chat/2">Chat 2</Link>
      </div>
    ),
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
