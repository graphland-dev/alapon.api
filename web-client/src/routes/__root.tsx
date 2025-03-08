import { IAuthStore } from '@/common/states/auth.atom';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';

export interface IRouteContext {
  auth: IAuthStore;
}

export const Route = createRootRouteWithContext<IRouteContext>()({
  component: () => (
    <>
      <Outlet />
    </>
  ),
  beforeLoad: async (ctx) => {
    console.log('beforeLoad', ctx.context.auth);
    // if (ctx.context?.auth?.isFetched) {
    //   return {
    //     auth: jotaiStore.get(authAtom),
    //   };
    // }

    // await fetchME();
    // return {
    //   auth: jotaiStore.get(authAtom),
    // };
  },
});
