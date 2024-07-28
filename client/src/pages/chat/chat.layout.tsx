import { Outlet } from 'react-router-dom';

const ChatLayout = () => {
  return (
    <div>
      <h1>ChatRoom</h1>
      <Outlet />
    </div>
  );
};

export default ChatLayout;
