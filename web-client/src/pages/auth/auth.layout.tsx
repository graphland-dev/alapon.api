import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="mx-auto my-10">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
