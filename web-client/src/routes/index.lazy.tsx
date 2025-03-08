import { useAuthState } from '@/common/states/auth.atom';
import { createLazyFileRoute, Link } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  const authState = useAuthState();
  return (
    <div className="flex flex-col items-center justify-center h-[100dvh] border-b-[6px] border-b-[#25D366]">
      <div className="text-center">
        <h2 className="mt-4 text-2xl">Alapon Chat</h2>
        <p className="text-sm text-[#667781] my-3">
          Send and receive messages without keeping your phone online.
        </p>
      </div>

      <pre>{JSON.stringify(authState, null, 2)}</pre>

      <p className="text-sm text-[#667781] flex items-center gap-1">
        <svg
          viewBox="0 0 10 12"
          height="12"
          width="10"
          preserveAspectRatio="xMidYMid meet"
          version="1.1"
        >
          <path
            d="M5.00847986,1.6 C6.38255462,1.6 7.50937014,2.67435859 7.5940156,4.02703389 L7.59911976,4.1906399 L7.599,5.462 L7.75719976,5.46214385 C8.34167974,5.46214385 8.81591972,5.94158383 8.81591972,6.53126381 L8.81591972,9.8834238 C8.81591972,10.4731038 8.34167974,10.9525438 7.75719976,10.9525438 L2.25767996,10.9525438 C1.67527998,10.9525438 1.2,10.4731038 1.2,9.8834238 L1.2,6.53126381 C1.2,5.94158383 1.67423998,5.46214385 2.25767996,5.46214385 L2.416,5.462 L2.41679995,4.1906399 C2.41679995,2.81636129 3.49135449,1.68973395 4.84478101,1.60510326 L5.00847986,1.6 Z M5.00847986,2.84799995 C4.31163824,2.84799995 3.73624912,3.38200845 3.6709675,4.06160439 L3.6647999,4.1906399 L3.663,5.462 L6.35,5.462 L6.35111981,4.1906399 C6.35111981,3.53817142 5.88169076,2.99180999 5.26310845,2.87228506 L5.13749818,2.85416626 L5.00847986,2.84799995 Z"
            fill="currentColor"
          ></path>
        </svg>
        <span>End-to-end encrypted</span>
      </p>

      <div className="flex gap-2 my-10">
        <Link
          to="/auth/join"
          className="px-4 py-2 text-xl text-white rounded-md bg-primary"
        >
          Join
        </Link>
        <Link
          to={'/auth/login'}
          className="px-4 py-2 text-xl text-white rounded-md bg-primary"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
